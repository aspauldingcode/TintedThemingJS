# Fallback for users without flakes enabled
# Usage: nix-shell
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Node.js and npm
    nodejs_20
    
    # Package managers
    nodePackages.npm
    
    # TypeScript
    nodePackages.typescript
    nodePackages.typescript-language-server
    
    # Helpful tools
    nodePackages.prettier
    nodePackages.eslint
    
    # For building native dependencies
    python3
    gnumake
    gcc
  ];

  shellHook = ''
    echo ""
    echo "🎨 TintedThemingJS Development Environment"
    echo "==========================================="
    echo ""
    echo "Node.js $(node --version)"
    echo "npm $(npm --version)"
    echo "TypeScript $(tsc --version | cut -d' ' -f2)"
    echo ""
    echo "Commands:"
    echo "  npm install    - Install dependencies"
    echo "  npm run build  - Build all packages"
    echo "  npm run dev    - Start Next.js dev server"
    echo "  npm run clean  - Clean build artifacts"
    echo ""
    
    # Set npm cache to local directory
    export npm_config_cache="$PWD/.npm-cache"
    
    # Add local node_modules/.bin to PATH
    export PATH="$PWD/node_modules/.bin:$PATH"
  '';
}
