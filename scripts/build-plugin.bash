echo "Building plugin"
cd react-app
echo "Installing npm dependencies..."
npm install
echo "✓ dependencies installed successfully"
echo "Building app..."
npm run build
echo "✓ built successfully"
echo "Testing app..."
npm run test -- --watchAll=false
echo "✓ tested successfully"
cd ..
echo "Creating plugin distribution..."
npm run dist 
echo "✓ plugin distribution created successfully" 
echo "✓ plugin build completed"
