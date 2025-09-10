# Cosmic Divider Component

A reusable divider component with cosmic deep-sea styling for the Vizor application.

## Features

- Customizable width and color
- Animation options
- Consistent cosmic styling
- Responsive design

## Usage

```tsx
import { CosmicDivider } from "@/components/modules/divider"

// Basic usage
<CosmicDivider />

// With custom width
<CosmicDivider width="w-40" />

// With custom color
<CosmicDivider color="blue-400" />

// With animation on scroll into view
<CosmicDivider animated />

// With custom class
<CosmicDivider className="my-12" />

// Combined options
<CosmicDivider 
  width="w-64" 
  color="teal-500" 
  animated 
  className="my-16" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | Additional CSS classes |
| width | string | "w-20" | The width of the center glow line |
| color | string | "cyan-400" | The color of the center glow line |
| animated | boolean | false | Whether to animate on scroll into view |
