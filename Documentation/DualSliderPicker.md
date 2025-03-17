# Dual Slider Picker Component

**File:** `components/common/dualSliderPicker.tsx`  
**Created:** March 17, 2024

## Overview

The Dual Slider Picker is a custom UI component that allows users to select two related values (color and outfit) simultaneously using a dual vertical slider interface. This component enhances the user experience by providing a more intuitive and visual way to select combinations of options.

## Features

- **Dual Vertical Sliders**: Separate columns for color and outfit selection
- **Visual Preview**: Central preview area showing the selected combination
- **Animated Interactions**: Smooth animations for opening, closing, and selecting items
- **Haptic Feedback**: Tactile feedback when interacting with the component
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Designed with a dark color scheme for better visibility

## Usage

```tsx
import DualSliderPicker from "../common/dualSliderPicker";

// Inside your component:
<DualSliderPicker
  colorOptions={colorOptions}
  outfitOptions={outfitOptions}
  selectedColor={selectedColor}
  selectedOutfit={selectedOutfit}
  onColorChange={setSelectedColor}
  onOutfitChange={setSelectedOutfit}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `colorOptions` | `PickerProp[]` | Array of color options with `name` and `value` properties |
| `outfitOptions` | `PickerProp[]` | Array of outfit options with `name` and `value` properties |
| `selectedColor` | `string` | Currently selected color value |
| `selectedOutfit` | `string` | Currently selected outfit value |
| `onColorChange` | `(value: string) => void` | Callback function when color selection changes |
| `onOutfitChange` | `(value: string) => void` | Callback function when outfit selection changes |

## Implementation Details

### Component Structure

1. **Button Trigger**: A pressable button that displays the current selection and opens the picker modal
2. **Modal**: A full-screen modal that appears when the picker is opened
3. **Dual Columns**: Two scrollable columns for color and outfit options
4. **Preview Section**: A central area that shows a preview of the selected combination
5. **Confirm Button**: A button to confirm the selection and close the modal

### Key Features

- **Color Mapping**: Automatically maps color names to their corresponding hex values
- **Icon Mapping**: Maps outfit names to appropriate Material Community Icons
- **Animations**: Uses React Native's Animated API for smooth transitions
- **Staggered Animations**: Items appear with a staggered delay for a polished feel
- **Haptic Feedback**: Provides tactile feedback using Expo's Haptics API

### Visual Design

- **Dark Theme**: Uses a dark color scheme with purple accents
- **Gradient Backgrounds**: Linear gradients for buttons and selected items
- **Shadow Effects**: Subtle shadows to create depth
- **Color Swatches**: Visual representation of colors
- **Icon Indicators**: Icons to represent different outfit types

## Integration

The Dual Slider Picker is integrated into the Styles Selection Modal, replacing the previous implementation that used two separate picker components. This change improves the user experience by:

1. Reducing the number of steps required to select a style
2. Providing a visual preview of the selected combination
3. Making the relationship between colors and outfits more intuitive

## Future Improvements

- Add support for more option types beyond colors and outfits
- Implement a search/filter functionality for large option lists
- Add accessibility features for screen readers
- Support for light theme
- Add more animation options and customization