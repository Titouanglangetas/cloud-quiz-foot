@description('Nom de base pour les ressources')
param projectName string = 'cloudquizfoot'

@description('Emplacement Azure')
param location string = 'northeurope'

//
// Storage Account (nécessaire pour Functions + Table Storage)
//
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '${projectName}stor'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

//
// Table Storage – Questions + Scores
//
resource questionsTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2022-09-01' = {
  name: '${storageAccount.name}/default/questions'
}

resource scoresTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2022-09-01' = {
  name: '${storageAccount.name}/default/scores'
}

//
// App Service Plan (Frontend)
//
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${projectName}-plan'
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
  }
}

//
// App Service (Frontend)
//
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: '${projectName}-frontend'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
  }
}

//
// Plan pour Azure Functions – Consumption (Y1)
//
resource functionPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${projectName}-funcplan'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
}

//
// Function App (Backend)
//
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: '${projectName}-functions'
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: functionPlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storageAccount.properties.primaryEndpoints.blob
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'python'
        }
        {
          name: 'TABLE_STORAGE_CONNECTION'
          value: storageAccount.properties.primaryEndpoints.table
        }
      ]
    }
  }
}
