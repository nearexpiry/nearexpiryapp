# Conversion Guide: Markdown to Word Document

This guide helps you convert the graduation report from Markdown (.md) to Word (.docx) format.

---

## Method 1: Using Pandoc (Recommended - Best Results)

### Step 1: Install Pandoc

**Windows:**
- Download installer from: https://pandoc.org/installing.html
- Run the installer
- Restart your terminal/command prompt

**Mac:**
```bash
brew install pandoc
```

**Linux:**
```bash
sudo apt-get install pandoc
```

### Step 2: Convert the Report

**Basic Conversion:**
```bash
pandoc graduation_project_report_simplified.md -o graduation_project_report.docx
```

**Advanced Conversion with Better Formatting:**
```bash
pandoc graduation_project_report_simplified.md -o graduation_project_report.docx \
  --reference-doc=custom-reference.docx \
  --toc \
  --number-sections \
  -V geometry:margin=1in
```

**Options Explained:**
- `--reference-doc`: Use a Word template for styling (optional, see below)
- `--toc`: Generate Table of Contents automatically
- `--number-sections`: Auto-number chapters/sections
- `-V geometry:margin=1in`: Set 1-inch margins

### Step 3: Post-Conversion Formatting

After conversion, you may want to adjust in Word:

1. **Fonts:**
   - Select All (Ctrl+A)
   - Change to your university's required font (usually Times New Roman 12pt)

2. **Headings:**
   - Apply Word heading styles (Heading 1, 2, 3) if not auto-applied
   - Adjust spacing before/after headings

3. **Tables:**
   - Tables convert automatically
   - You may want to apply Word table styles
   - Adjust column widths if needed

4. **Images:**
   - If diagrams are embedded, they'll convert
   - You may need to resize or reposition
   - **Replace text-based diagrams with generated PNG images from DIAGRAM_CODES.md**

5. **Code Blocks:**
   - Will appear in monospace font
   - Consider applying a gray background for code sections

---

## Method 2: Using Online Converters (Quick & Easy)

If you can't install Pandoc, use online converters:

### Option A: CloudConvert
**Website:** https://cloudconvert.com/md-to-docx

**Steps:**
1. Go to https://cloudconvert.com/md-to-docx
2. Upload `graduation_project_report_simplified.md`
3. Click "Convert"
4. Download the .docx file

**Pros:** Fast, no installation
**Cons:** May not handle complex formatting as well as Pandoc

### Option B: Markdown to Word
**Website:** https://word2md.com/

**Steps:**
1. Go to https://word2md.com/
2. Paste your markdown content or upload file
3. Download as Word document

---

## Method 3: Using Visual Studio Code + Extension

If you use VS Code:

### Step 1: Install Extension
- Open VS Code
- Install extension: "Markdown PDF" or "Markdown All in One"

### Step 2: Export
- Open your .md file
- Right-click in editor
- Select "Markdown: Export to docx" (if extension supports it)

---

## Table Reference: All Tables in Your Report

Here's a complete list of all tables that will be converted:

### Chapter 3: Design

**Table 1: Technology Stack Overview**
- Location: Chapter 3.2.2.F or 4.1
- Columns: Category, Technology, Version, Purpose
- Rows: 11 (Frontend, Backend, Database, etc.)

**Table 2: API Endpoints by Category**
- Location: Chapter 3.1.3 or 4.2.4
- Columns: Endpoint, Method, Description, Auth Required
- Rows: 30+ endpoints across categories

**Table 3: Design Considerations**
- Location: Chapter 3.2.8
- Columns: Design Consideration, Project Application, Relevant Location
- Rows: 12 (Performance, Serviceability, Economic, etc.)

### Chapter 4: Implementation

**Technology Comparison Tables:**
- Frontend Framework Comparison
- Backend Framework Comparison
- Database Comparison
- Columns: Framework/Tech, Pros, Cons
- Rows: 3-4 per table

### Chapter 5: Results and Discussion

**Table: API Response Times**
- Columns: Endpoint, Average (ms), 95th Percentile (ms), Target, Status
- Rows: 6 endpoints

**Table: Page Load Times**
- Columns: Page, First Contentful Paint, Time to Interactive, Total Load Time
- Rows: 4 pages

**Table: Cross-Browser Testing**
- Columns: Browser, Version, Compatibility, Issues
- Rows: 4 browsers

**Table: Responsive Testing**
- Columns: Device Category, Screen Size, Layout, Issues
- Rows: 5 device categories

**Table: Comparison of Food Waste Platforms**
- Location: Chapter 2.4.5
- Columns: Platform, Geographic Focus, Target Sellers, Pricing Model, Differentiation
- Rows: 5 platforms

### Chapter 6: Economics

**Table 4: Development Cost Breakdown**
- Columns: Item, Estimated Hours, Monetary Cost, Notes
- Rows: 10+ cost items

**Table: Monthly Operating Costs**
- Columns: Service, Free Tier, Paid Tier, Notes
- Rows: 7+ services

**Table: Environmental Benefits**
- Columns: Metric, Conservative Estimate, Optimistic Estimate
- Rows: 4 metrics

### Chapter 7: Project Management

**Table 5: Resource Allocation**
- Columns: Role, Responsibilities, Time Allocation, Cost
- Rows: 7 roles

**Table: Technical Resources**
- Columns: Resource, Purpose, Cost, Justification
- Rows: 9 resources

**Table 6: Risk Assessment and Mitigation**
- Columns: Risk Category, Risk Description, Probability, Impact, Mitigation Strategy
- Rows: 11+ risks

**Table 7: Procurement Details**
- Columns: Item, Source, License/Terms, Cost, Procurement Process
- Rows: 8+ items

**Table: Quality Metrics**
- Columns: Metric, Target, Actual, Status
- Rows: 6 metrics

---

## Post-Conversion Checklist

After converting to .docx, verify these elements:

### ✅ Structure
- [ ] All chapters present (1-8)
- [ ] Abstract at beginning
- [ ] References section complete
- [ ] Appendix A included
- [ ] Table of Contents generated (if using --toc)

### ✅ Tables
- [ ] All tables converted properly
- [ ] Column headers bold
- [ ] Borders visible
- [ ] Text aligned correctly
- [ ] Table captions/numbers visible

### ✅ Formatting
- [ ] Headings properly styled (Heading 1, 2, 3)
- [ ] Body text: Times New Roman 12pt (or required font)
- [ ] Line spacing: 1.5 or Double (check university requirements)
- [ ] Margins: 1 inch all sides (adjust as needed)
- [ ] Page numbers added

### ✅ Code Blocks
- [ ] Code appears in monospace font
- [ ] Syntax highlighting preserved (if possible)
- [ ] Code blocks have background color (optional but nice)

### ✅ Lists
- [ ] Bullet points formatted correctly
- [ ] Numbered lists sequential
- [ ] Indentation preserved

### ✅ Special Elements
- [ ] **Replace text-based diagrams with PNG images** from DIAGRAM_CODES.md
- [ ] Equations/formulas render correctly
- [ ] Links converted to hyperlinks (optional: remove hyperlink formatting)
- [ ] Block quotes styled appropriately

### ✅ References
- [ ] All 20 IEEE citations present
- [ ] Formatting consistent
- [ ] Links clickable (optional)

---

## Tips for Best Results

### 1. Create a Custom Reference Document (Advanced)

To maintain consistent formatting:

**Step 1:** Create a Word document with your desired styles
- Set font, size, colors
- Define Heading 1, 2, 3 styles
- Set up page layout, margins
- Save as `custom-reference.docx`

**Step 2:** Use it in conversion
```bash
pandoc graduation_project_report_simplified.md \
  -o graduation_project_report.docx \
  --reference-doc=custom-reference.docx
```

### 2. Handle Long Tables

If tables are too wide:
- In Word, select table → Layout → AutoFit → AutoFit to Window
- Or manually adjust column widths
- Consider rotating page to Landscape for very wide tables

### 3. Add Page Breaks

Insert page breaks before major chapters in Word:
- Place cursor before chapter heading
- Insert → Page Break (Ctrl+Enter)

### 4. Generate Table of Contents in Word

If Pandoc doesn't generate TOC:
- Place cursor where TOC should go
- References → Table of Contents → Automatic Table

### 5. Add Headers/Footers

- Insert → Header/Footer
- Add university name, your name, page numbers
- Different first page (for cover page)

---

## Troubleshooting Common Issues

### Issue 1: Tables Look Messy
**Solution:**
- Select all tables: Find & Replace → Find: `^t` (table marker)
- Apply consistent table style
- Use "Distribute Columns Evenly"

### Issue 2: Code Blocks Not Formatted
**Solution:**
- Search for code blocks (monospace text)
- Apply "Code" style or gray background
- Font: Consolas or Courier New

### Issue 3: Headings Not Styled
**Solution:**
- Manually apply Heading 1, 2, 3 styles
- Or use Find/Replace with formatting

### Issue 4: Images/Diagrams Missing
**Solution:**
- This is expected—text diagrams won't convert to images
- **Generate PNG images from DIAGRAM_CODES.md**
- Insert manually in Word at correct locations

### Issue 5: Unicode/Special Characters
**Solution:**
- Ensure document encoding is UTF-8
- Re-run Pandoc with `--from=markdown+smart`

---

## Recommended Workflow

1. **Generate Diagram Images**
   - Go to https://mermaid.live/
   - Generate all 12 diagrams from DIAGRAM_CODES.md
   - Save as PNG (1200px width)

2. **Convert Markdown to Word**
   ```bash
   pandoc graduation_project_report_simplified.md -o graduation_project_report.docx --toc
   ```

3. **Open in Word**
   - Review overall structure

4. **Format Document**
   - Set fonts, margins, spacing
   - Apply heading styles
   - Format tables

5. **Insert Diagrams**
   - Replace text-based diagrams with PNG images
   - Resize and position appropriately
   - Add figure captions (Figure 1, Figure 2, etc.)

6. **Add Front Matter**
   - Cover page with university logo
   - Declaration page
   - Abstract (already in document)
   - Table of Contents
   - List of Figures
   - List of Tables

7. **Final Review**
   - Proofread
   - Check page numbers
   - Verify all references present
   - Run spell check

8. **Export to PDF** (for submission)
   - File → Save As → PDF
   - Preserve document properties

---

## University-Specific Requirements

Adjust the document to match your university's requirements:

### Common Requirements:
- **Font:** Times New Roman, 12pt
- **Line Spacing:** 1.5 or Double
- **Margins:** 1 inch all sides (or 1.5 inch left for binding)
- **Page Numbers:** Bottom center or top right
- **Cover Page:** Include university logo, title, name, ID, supervisor, date
- **Citation Format:** IEEE (already in report)

Check your university's thesis/project formatting guide and adjust accordingly.

---

## Quick Command Reference

```bash
# Basic conversion
pandoc input.md -o output.docx

# With table of contents
pandoc input.md -o output.docx --toc

# With custom reference doc
pandoc input.md -o output.docx --reference-doc=template.docx

# With numbered sections
pandoc input.md -o output.docx --number-sections

# All options combined
pandoc graduation_project_report_simplified.md -o graduation_project_report.docx \
  --toc \
  --number-sections \
  --reference-doc=custom-reference.docx \
  -V geometry:margin=1in

# Convert to PDF (requires LaTeX)
pandoc input.md -o output.pdf --pdf-engine=xelatex
```

---

## Final Note

The markdown format is already very clean and structured, so conversion should be straightforward. The main manual work will be:

1. **Inserting diagram images** (replacing text diagrams)
2. **Applying your university's specific formatting requirements**
3. **Adding cover page, declaration, and other front matter**

All tables will convert automatically and should require minimal adjustment!

---

**Status:** ✅ Conversion guide complete
**Next Steps:** Install Pandoc → Convert → Format → Insert Diagrams → Review
