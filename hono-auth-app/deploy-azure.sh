#!/bin/bash
# Deploy Hono app to Azure Functions

# Set variables
RESOURCE_GROUP="hono-auth-rg"
FUNCTION_APP="hono-auth-func"
STORAGE_ACCOUNT="honoauthstorage$RANDOM"

# Create resource group
az group create --name $RESOURCE_GROUP --location eastus

# Create storage account
az storage account create --name $STORAGE_ACCOUNT --location eastus --resource-group $RESOURCE_GROUP --sku Standard_LRS

# Create function app
az functionapp create --resource-group $RESOURCE_GROUP --consumption-plan-location eastus --runtime node --runtime-version 18 --functions-version 4 --name $FUNCTION_APP --storage-account $STORAGE_ACCOUNT

# Deploy code
func azure functionapp publish $FUNCTION_APP --typescript

echo "Deployment to Azure Functions completed."
