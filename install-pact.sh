#!/bin/bash

# Simple install script for pact CLI
echo "Installing PACT CLI globally..."
npm install -g .

echo ""
echo "Adding aliases to ~/.bashrc or ~/.zshrc is recommended:"
echo "alias c='pact c'"
echo "alias pr='pact pr'"
echo ""
echo "Don't forget to set OPENAI_API_KEY in your environment!"
