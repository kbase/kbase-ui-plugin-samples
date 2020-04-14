echo "Building plugin"
cd react-app
echo "Installing npm dependencies..."
yarn install
echo "✓ dependencies installed successfully"
echo "Building app..."
yarn build
echo "✓ built successfully"
echo "Testing app..."
yarn test --watchAll=false
echo "✓ tested successfully"
cd ..
echo "Creating plugin distribution..."
yarn dist 
echo "✓ plugin distribution created successfully" 
echo "✓ plugin build completed"