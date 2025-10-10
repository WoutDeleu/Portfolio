# Portfolio Content Configuration

This directory is the **single source of truth** for all portfolio content. Everything - JSON data, images, and configuration files - is centralized here and automatically synced to `src/assets/` during build and development.

## 📁 Directory Structure

```
content/
├── certifications/     # Professional certifications
├── education/          # Educational background
├── interests/          # Personal interests
├── languages/          # Spoken languages
├── personal/           # Personal information
├── skills/             # Technical skills
├── social-media/       # Social media links
├── career/             # Career history
├── projects/           # Projects portfolio
├── timeline-education/ # Education timeline
├── images/             # All images (logos, photos, icons)
└── config/             # Application configuration (email, etc.)
```

## 🔧 How to Update Content

### Personal Information
Edit `personal/info.json` to update:
- Name, birth date, title
- Professional description
- Contact information
- Education details

### Social Media Links
1. **Add new platform**: Create a new file in `social-media/` (e.g., `twitter.json`)
2. **Update index**: Add the filename to `social-media/index.json`
3. **Remove platform**: Delete the file and remove from index

Example social media file:
```json
{
  "id": "twitter",
  "name": "Twitter",
  "url": "https://twitter.com/username",
  "icon": "<svg>...</svg>",
  "color": "#1DA1F2",
  "order": 3
}
```

### Interests
1. **Add new interest**: Create file in `interests/` (e.g., `photography.json`)
2. **Update index**: Add filename to `interests/index.json`
3. **Customize**: Set name, description, icon, color, and order

### Skills & Languages
Similar structure to interests - create individual files and update respective index files.

## 🚀 After Making Changes

1. **Development**: Changes are automatically synced to `src/assets/data/`
2. **Build**: Run `npm run sync-content` to sync manually if needed
3. **Deploy**: Build process automatically includes latest content

## 📝 JSON Schema Reference

### Personal Info
```json
{
  "firstName": "string",
  "lastName": "string",
  "birthDate": "YYYY-MM-DD",
  "title": "string",
  "description": "string",
  "contact": { ... },
  "education": { ... }
}
```

### Social Media
```json
{
  "id": "string",
  "name": "string",
  "url": "string",
  "icon": "SVG string",
  "color": "hex color",
  "order": "number"
}
```

### Interest/Skill
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "icon": "SVG string",
  "color": "hex color",
  "order": "number"
}
```

## 🎨 Icon Guidelines

- Use SVG format for scalability
- Include `fill="currentColor"` for theme compatibility
- Recommended size: 24x24 viewBox
- Test icons in both light and dark themes

## 🔄 Sync Process

**All content from `/content` is automatically synced to `/src/assets/` during:**
- Development server startup (`npm start`)
- Build process (`npm run build`)
- Manual sync with `npm run sync-content`

**What gets synced:**
- `/content/*/` → `/src/assets/data/*/` (all JSON data)
- `/content/images/` → `/src/assets/images/` (all images)
- `/content/config/` → `/src/assets/config/` (all configuration files)

**Important:** The `/src/assets/` directories are **gitignored** and generated automatically. Always edit files in `/content/`, never in `/src/assets/`.

## 🆘 Troubleshooting

- **JSON errors**: Validate JSON syntax with online tools
- **Icons not showing**: Check SVG syntax and encoding
- **Changes not appearing**: Restart development server
- **Order issues**: Check `order` field in JSON files

## 📋 Content Management Checklist

- [ ] Update personal information
- [ ] Add/remove social media links
- [ ] Update interests and skills
- [ ] Verify all JSON files are valid
- [ ] Test changes in development
- [ ] Commit changes to git