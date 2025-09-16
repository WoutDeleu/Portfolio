# 📄 Content Management Guide

## 🎯 Quick Start

All portfolio content is managed through JSON files in the `/content` directory:

```
📁 content/                  ← Edit these files to update your portfolio
├── 📋 README.md            ← Detailed documentation
├── 👤 personal/            ← Your personal information
├── 🔗 social-media/        ← LinkedIn, GitHub, etc.
├── ❤️ interests/           ← Your hobbies and interests
├── 🌐 languages/           ← Programming languages
└── ⚡ skills/              ← Technical skills
```

## ✏️ Making Changes

1. **Edit content**: Modify JSON files in `/content` directory
2. **Sync changes**: Run `npm run sync-content` or restart dev server
3. **View changes**: Content automatically updates in the application

## 🚀 Common Tasks

### Update Personal Info
```bash
# Edit your name, bio, contact info
vim content/personal/info.json
```

### Add Social Media Link
```bash
# Create new platform file
echo '{"id":"twitter","name":"Twitter","url":"https://twitter.com/you","icon":"<svg>...</svg>","color":"#1DA1F2","order":3}' > content/social-media/twitter.json

# Add to index
# Edit content/social-media/index.json and add "twitter" to the array
```

### Add New Interest
```bash
# Create interest file
echo '{"id":"photography","name":"Photography","description":"Capturing moments...","icon":"<svg>...</svg>","color":"#ff6b6b","order":5}' > content/interests/photography.json

# Add to index
# Edit content/interests/index.json and add "photography" to the array
```

## 📚 Full Documentation

See `/content/README.md` for complete documentation including:
- JSON schemas for all content types
- Icon guidelines
- Troubleshooting guide
- Content management checklist

## 🔄 Automatic Sync

Content is automatically synced when you:
- Run `npm start` (development)
- Run `npm run build` (production)
- Run `npm run sync-content` (manual)

The content files are copied from `/content` to `/src/assets/data` where Angular can access them.

---
💡 **Tip**: Keep this simple! Just edit the JSON files in `/content` and restart your dev server to see changes.