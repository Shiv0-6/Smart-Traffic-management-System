# Dark Mode Feature Guide

## Overview

The Smart Traffic Management System now includes a complete dark mode implementation with a theme toggle that allows users to switch between Light, Dark, and System themes. The theme preference is saved locally and persists across sessions.

---

## ✨ Features

### Theme Options

1. **Light Mode** ☀️
   - Bright, clean interface
   - High contrast for daylight viewing
   - Reduced eye strain in bright environments

2. **Dark Mode** 🌙
   - Professional monitoring system aesthetic
   - Reduced eye strain in low-light environments
   - Lower power consumption on OLED screens
   - Default theme for the application

3. **System Mode** 💻
   - Automatically matches your operating system theme
   - Switches between light and dark based on system settings
   - Seamless integration with OS preferences

### Key Features

✅ **Persistent Theme**: Your theme choice is saved in localStorage  
✅ **Smooth Transitions**: Animated theme switching  
✅ **System Integration**: Respects OS dark mode preferences  
✅ **Accessible**: Keyboard navigation and screen reader support  
✅ **Visual Indicators**: Current theme marked with checkmark  
✅ **Icon Animation**: Smooth sun/moon icon transitions  

---

## 🎨 How to Use

### Switching Themes

1. **Locate the Theme Toggle**
   - Look for the sun/moon icon in the top-right corner of the header
   - It's positioned before the login/user section

2. **Open the Theme Menu**
   - Click the sun/moon icon button
   - A dropdown menu will appear with three options

3. **Select Your Preferred Theme**
   - **Light**: Click the sun icon option
   - **Dark**: Click the moon icon option
   - **System**: Click the monitor icon option

4. **Theme Applied Instantly**
   - The theme changes immediately
   - Your preference is saved automatically
   - The checkmark shows your current selection

### Visual Indicators

#### Theme Toggle Button
- **Light Mode Active**: Sun icon visible
- **Dark Mode Active**: Moon icon visible
- **Hover Effect**: Button highlights on hover

#### Dropdown Menu
- **Current Theme**: Marked with ✓ checkmark
- **Icons**: Sun, Moon, and Monitor for each option
- **Hover Effect**: Options highlight on hover

---

## 🛠️ Technical Implementation

### Components Created

#### 1. ThemeProvider Component
**Location**: `src/components/theme/ThemeProvider.tsx`

**Purpose**: Manages theme state and applies theme classes to the document

**Features**:
- React Context for theme state
- localStorage persistence
- System theme detection
- Automatic theme application

**Usage**:
```tsx
import { ThemeProvider } from '@/components/theme/ThemeProvider';

<ThemeProvider defaultTheme="dark" storageKey="traffic-ui-theme">
  {children}
</ThemeProvider>
```

#### 2. ThemeToggle Component
**Location**: `src/components/theme/ThemeToggle.tsx`

**Purpose**: UI component for theme switching

**Features**:
- Dropdown menu with three options
- Animated sun/moon icons
- Current theme indicator
- Accessible button

**Usage**:
```tsx
import { ThemeToggle } from '@/components/theme/ThemeToggle';

<ThemeToggle />
```

#### 3. useTheme Hook
**Location**: `src/components/theme/ThemeProvider.tsx`

**Purpose**: Access theme state and setter in any component

**Usage**:
```tsx
import { useTheme } from '@/components/theme/ThemeProvider';

const { theme, setTheme } = useTheme();

// Get current theme
console.log(theme); // 'light' | 'dark' | 'system'

// Change theme
setTheme('dark');
```

### Integration Points

#### App.tsx
```tsx
import { ThemeProvider } from '@/components/theme/ThemeProvider';

<ThemeProvider defaultTheme="dark" storageKey="traffic-ui-theme">
  <AuthProvider>
    {/* App content */}
  </AuthProvider>
</ThemeProvider>
```

#### Header.tsx
```tsx
import { ThemeToggle } from '@/components/theme/ThemeToggle';

<div className="flex items-center gap-4">
  <ThemeToggle />
  {/* Other header items */}
</div>
```

---

## 🎨 Design System Integration

### CSS Variables

The theme system uses CSS variables defined in `src/index.css`:

#### Light Mode Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

#### Dark Mode Variables
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Tailwind CSS Classes

All components use semantic Tailwind classes that automatically adapt to the theme:

- `bg-background` - Background color
- `text-foreground` - Text color
- `bg-card` - Card background
- `text-card-foreground` - Card text
- `bg-primary` - Primary color
- `text-primary-foreground` - Primary text
- `border-border` - Border color
- `bg-muted` - Muted background
- `text-muted-foreground` - Muted text

### Custom Gradients

Custom gradients are defined for both themes:

```css
/* Light Mode */
:root {
  --gradient-primary: linear-gradient(135deg, hsl(221.2 83.2% 53.3%), hsl(262.1 83.3% 57.8%));
  --gradient-accent: linear-gradient(135deg, hsl(262.1 83.3% 57.8%), hsl(291.1 83.3% 57.8%));
}

/* Dark Mode */
.dark {
  --gradient-primary: linear-gradient(135deg, hsl(217.2 91.2% 59.8%), hsl(262.1 83.3% 57.8%));
  --gradient-accent: linear-gradient(135deg, hsl(262.1 83.3% 57.8%), hsl(291.1 83.3% 57.8%));
}
```

---

## 🔧 Customization

### Changing Default Theme

Edit `src/App.tsx`:

```tsx
<ThemeProvider defaultTheme="light" storageKey="traffic-ui-theme">
  {/* ... */}
</ThemeProvider>
```

Options: `"light"` | `"dark"` | `"system"`

### Changing Storage Key

Edit `src/App.tsx`:

```tsx
<ThemeProvider defaultTheme="dark" storageKey="my-custom-key">
  {/* ... */}
</ThemeProvider>
```

### Adding Custom Theme Colors

Edit `src/index.css`:

```css
:root {
  --custom-color: 200 100% 50%;
}

.dark {
  --custom-color: 200 80% 60%;
}
```

Then use in components:

```tsx
<div className="bg-[hsl(var(--custom-color))]">
  Custom colored element
</div>
```

---

## 📱 Responsive Behavior

### Desktop
- Theme toggle button in header
- Dropdown menu with all options
- Smooth animations

### Mobile
- Theme toggle accessible in mobile menu
- Touch-friendly button size
- Same functionality as desktop

---

## ♿ Accessibility

### Keyboard Navigation
- **Tab**: Focus on theme toggle button
- **Enter/Space**: Open dropdown menu
- **Arrow Keys**: Navigate menu options
- **Enter**: Select theme option
- **Esc**: Close dropdown menu

### Screen Readers
- Button labeled "Toggle theme"
- Menu options clearly labeled
- Current theme announced
- State changes announced

### Visual Accessibility
- High contrast in both themes
- Clear focus indicators
- Sufficient color contrast ratios
- Icon + text labels

---

## 🐛 Troubleshooting

### Theme Not Persisting

**Problem**: Theme resets on page reload

**Solutions**:
1. Check browser localStorage is enabled
2. Verify storage key is consistent
3. Clear browser cache and try again
4. Check browser console for errors

### Theme Not Switching

**Problem**: Clicking theme options doesn't change theme

**Solutions**:
1. Check browser console for errors
2. Verify ThemeProvider is wrapping the app
3. Ensure CSS variables are defined
4. Try refreshing the page

### System Theme Not Working

**Problem**: System option doesn't match OS theme

**Solutions**:
1. Verify OS dark mode is enabled/disabled
2. Check browser supports `prefers-color-scheme`
3. Try switching OS theme and refreshing
4. Use Light or Dark mode instead

### Icons Not Animating

**Problem**: Sun/moon icons don't transition smoothly

**Solutions**:
1. Check CSS transitions are enabled
2. Verify Tailwind CSS is loaded
3. Clear browser cache
4. Check for CSS conflicts

---

## 🎯 Best Practices

### For Users

1. **Choose Based on Environment**
   - Use Light mode in bright environments
   - Use Dark mode in low-light environments
   - Use System mode for automatic switching

2. **Consider Eye Comfort**
   - Dark mode reduces eye strain at night
   - Light mode is better for detailed work in daylight
   - Take breaks regardless of theme

3. **Battery Saving**
   - Dark mode saves battery on OLED screens
   - Consider using dark mode on mobile devices

### For Developers

1. **Always Use Semantic Classes**
   - Use `bg-background` instead of `bg-white`
   - Use `text-foreground` instead of `text-black`
   - Use `border-border` instead of `border-gray-200`

2. **Test Both Themes**
   - Verify all components in light mode
   - Verify all components in dark mode
   - Check contrast ratios

3. **Avoid Hardcoded Colors**
   - Don't use `bg-blue-500` directly
   - Define semantic colors in CSS variables
   - Use Tailwind's theme system

4. **Consider Gradients**
   - Gradients should work in both themes
   - Test gradient visibility
   - Adjust opacity if needed

---

## 📊 Browser Support

### Supported Browsers

✅ **Chrome/Edge**: Full support  
✅ **Firefox**: Full support  
✅ **Safari**: Full support  
✅ **Opera**: Full support  

### System Theme Detection

✅ **Windows 10/11**: Supported  
✅ **macOS**: Supported  
✅ **Linux**: Supported (varies by DE)  
✅ **iOS**: Supported  
✅ **Android**: Supported  

---

## 🚀 Future Enhancements

### Planned Features

- 🔜 Custom theme colors
- 🔜 Theme presets (Blue, Green, Purple)
- 🔜 High contrast mode
- 🔜 Reduced motion mode
- 🔜 Theme scheduling (auto-switch at sunset)
- 🔜 Per-page theme preferences

### Potential Improvements

- 🔜 Theme preview before applying
- 🔜 Smooth color transitions
- 🔜 Theme export/import
- 🔜 Custom gradient builder
- 🔜 Accessibility checker

---

## 📖 Related Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete user guide
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Admin guide
- **[README.md](./README.md)** - Project overview
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## 🎉 Conclusion

The dark mode feature provides a complete theme switching experience with:

✅ **Three Theme Options**: Light, Dark, and System  
✅ **Persistent Preferences**: Saved in localStorage  
✅ **Smooth Transitions**: Animated theme changes  
✅ **Accessible**: Keyboard and screen reader support  
✅ **Responsive**: Works on all devices  
✅ **Customizable**: Easy to extend and modify  

**Ready to switch themes?** Click the sun/moon icon in the header! 🌓
