// This file is auto-generated from ui-blueprint.xml
export const DEFAULT_BLUEPRINT = `<?xml version="1.0" encoding="UTF-8"?>
<blueprint version="1.0">
  <layout>
    <header height="auto" sticky="true">
      <grid columns="1fr auto 1fr" gap="1rem" align="center" padding="1rem 2rem">
        <!-- Left Column: Title -->
        <column align="start">
          <text variant="h1" size="1.25rem" weight="600">
            🎨 TintedThemingJS <span opacity="0.6">( {framework.name} )</span>
          </text>
        </column>
        
        <!-- Center Column: Framework Switcher (Desktop) -->
        <column align="center" visibility="desktop-only">
          <component type="framework-switcher" />
        </column>
        
        <!-- Right Column: Theme Switcher (Desktop) -->
        <column align="end" visibility="desktop-only">
          <row gap="0.5rem" align="center">
            <label for="theme-select" size="0.9rem" color="var(--base04)">Theme:</label>
            <component type="theme-switcher" />
          </row>
        </column>
        
        <!-- Mobile Toggle (Mobile) -->
        <column align="end" visibility="mobile-only">
           <component type="mobile-menu-toggle" />
        </column>
      </grid>
    </header>
    
    <body>
       <slot name="main-content" />
    </body>
    
    <mobile-menu>
       <component type="framework-switcher" />
       <component type="theme-switcher" />
    </mobile-menu>
  </layout>
</blueprint>
`;
