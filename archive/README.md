# Archive

This folder contains **built artifacts** that are regenerated on each build.

## 📁 Contents

### `/archive/dist/` - Build Output
The compiled production build of the application:
- **index.html** - Entry HTML file
- **assets/** - Bundled JavaScript and CSS

**Note**: This folder is regenerated every time you run `npm run build`

---

## 🔄 How Builds Work

### Development Mode
```bash
npm run dev
```
- Runs Vite dev server
- No build artifacts created
- Hot reload enabled
- Serves from source files

### Production Build
```bash
npm run build
```
- Compiles all source files
- Creates `/dist` folder (moved to `/archive/dist`)
- Optimizes and minifies code
- Generates production-ready files

---

## 🗑️ Why Archive?

The `dist` folder is:
- ✅ **Automatically regenerated** - No need to keep old builds
- ✅ **Large** - Contains bundled code (400KB+)
- ✅ **Not source code** - Generated from `/src`
- ✅ **Gitignored** - Shouldn't be in version control

By moving it to `/archive`, we:
- Keep the root directory clean
- Make it clear these are build artifacts
- Preserve latest build for reference

---

## 📦 Current Build Info

**Last Build**: Check `/archive/dist/index.html` timestamp

**Bundle Size**: ~398 KB (121 KB gzipped)

**Contents**:
- All templates (Hook, Explain, Apply, Reflect)
- All components (Wizard, MultiScene, Transitions)
- All utilities (SDK, animations, effects)
- All dependencies (React, Remotion, etc.)

---

## 🚀 Deployment

To deploy the application:

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Files will be in** `/archive/dist/`

3. **Deploy the dist folder** to:
   - Static hosting (Vercel, Netlify, etc.)
   - Web server (Apache, Nginx)
   - CDN

4. **Serve `index.html`** as the entry point

---

## 🔧 Build Configuration

Build is configured in:
- **vite.config.js** - Vite build settings
- **package.json** - Build scripts

Default output:
- **Output dir**: `dist/` → moved to `archive/dist/`
- **Format**: ES modules
- **Minification**: Enabled
- **Source maps**: Disabled in production

---

## 📊 Build Stats

```
Build Time: ~1.5 seconds
Output Files: 3
  - index.html (1.1 KB)
  - assets/index-[hash].js (398 KB, 121 KB gzipped)
  - assets/[other-assets]

Total: ~400 KB uncompressed, ~122 KB gzipped
```

---

## 🗂️ Folder Structure

```
/archive/
├── README.md          ← You are here
└── dist/              ← Latest build output
    ├── index.html     Entry point
    └── assets/        Bundled JS/CSS
        └── index-[hash].js
```

---

## ⚠️ Important Notes

1. **Don't edit files in /archive/dist/**
   - They're overwritten on each build
   - Edit source files in `/src/` instead

2. **Don't commit /archive/dist/ to git**
   - Already in `.gitignore`
   - Build artifacts shouldn't be versioned

3. **Regenerate before deploying**
   - Always run `npm run build` before deploying
   - Ensures latest code is included

---

## 🔄 Regenerating Build

If you need to rebuild:

```bash
# Clean old build (optional)
rm -rf archive/dist

# Build fresh
npm run build

# Build will be created in dist/, move to archive
mv dist archive/
```

---

**For source code, see**: `/src/` directory  
**For documentation, see**: `/readme/` directory  
**For legacy files, see**: `/legacy/` directory
