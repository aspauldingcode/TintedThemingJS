{
  description = "TintedThemingJS - TypeScript/JavaScript API for Base16 and Base24 color themes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
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
        };

        # Package for building the site
        packages.default = pkgs.buildNpmPackage {
          pname = "tinted-theming-js";
          version = "0.1.0";
          src = ./.;
          
          npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
          
          buildPhase = ''
            npm run build
          '';
          
          installPhase = ''
            mkdir -p $out
            cp -r packages/core/dist $out/core
            cp -r packages/react/dist $out/react
          '';
        };
      }
    );
}
