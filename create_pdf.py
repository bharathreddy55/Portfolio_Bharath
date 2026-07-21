import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

pdf_path = "Bharath_Kumar_Reddy_Resume.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Colors
PRIMARY = colors.HexColor('#000000')
SECONDARY = colors.HexColor('#333333')
LINK_COLOR = colors.HexColor('#0056b3')
LINE_COLOR = colors.HexColor('#222222')

# Styles
name_style = ParagraphStyle(
    'NameStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    alignment=1, # Center
    textColor=PRIMARY
)

contact_style = ParagraphStyle(
    'ContactStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13,
    alignment=1, # Center
    textColor=SECONDARY
)

section_title = ParagraphStyle(
    'SectionTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=PRIMARY,
    spaceAfter=2
)

body_style = ParagraphStyle(
    'BodyStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=SECONDARY
)

italic_sub = ParagraphStyle(
    'ItalicSub',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=9.5,
    leading=13,
    textColor=SECONDARY
)

bullet_style = ParagraphStyle(
    'BulletStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12.5,
    textColor=SECONDARY,
    leftIndent=14,
    firstLineIndent=-10,
    spaceAfter=3
)

story = []

# Title
story.append(Paragraph("Allampati Bharath Kumar Reddy", name_style))
story.append(Spacer(1, 4))

# Contact Line
contact_text = (
    f'<a href="mailto:bharath02032508@gmail.com" color="{LINK_COLOR.hexval()}">bharath02032508@gmail.com</a> | '
    f'+91-8977984507 | '
    f'<a href="https://linkedin.com/in/bharath-kumar-reddy-allampati-930152275/" color="{LINK_COLOR.hexval()}">LinkedIn</a> | '
    f'<a href="https://github.com/bharathreddy55" color="{LINK_COLOR.hexval()}">GitHub</a>'
)
story.append(Paragraph(contact_text, contact_style))
story.append(Spacer(1, 8))

def add_heading(title_text):
    story.append(Paragraph(title_text, section_title))
    story.append(HRFlowable(width="100%", thickness=0.8, color=LINE_COLOR, spaceBefore=2, spaceAfter=6))

# ABOUT ME
add_heading("ABOUT ME")
about_p = (
    "Computer Science graduate with hands-on experience building and deploying full-stack applications "
    "using Java, JavaScript, React, Node.js, SQL, and cloud platforms. Strong foundation in object-oriented programming, "
    "data structures, databases, and software development fundamentals. Built production-style projects featuring "
    "authentication, REST-based integrations, AI capabilities, real-time features, and cloud deployment. "
    "Seeking a Software Engineering role focused on building scalable, reliable, and high-quality applications."
)
story.append(Paragraph(about_p, body_style))
story.append(Spacer(1, 8))

# PROJECTS
add_heading("PROJECTS")

# Project 1
p1_title = f'<b>Aether Cast — Podcast Streaming Platform</b> (<a href="https://github.com/bharathreddy55/AetherCast-MERN" color="{LINK_COLOR.hexval()}">link</a>)'
story.append(Paragraph(p1_title, body_style))
story.append(Paragraph('<i>React.js, Node.js, Express.js, MongoDB Atlas, Supabase Auth, Gemini API</i>', italic_sub))
story.append(Spacer(1, 2))
story.append(Paragraph('• Built a full-stack podcast platform with React 18, Node.js/Express, MongoDB Atlas, and Supabase authentication, featuring a global sticky audio player, PWA offline support, and live synced transcripts. Added automated API tests for authentication, validation, and core backend workflows.', bullet_style))
story.append(Paragraph('• Integrated Google Gemini 1.5 Flash API for AI-powered episode summaries and smart tagging, along with real-time listening parties, creator drafts workspace, and in-browser recording with waveform visualization.', bullet_style))
story.append(Paragraph('• Deployed frontend on Vercel and backend on Render with a full admin command center for platform-wide metrics, user management, and content moderation.', bullet_style))
story.append(Spacer(1, 6))

# Project 2
p2_title = f'<b>GATE Flow ( In Progress )</b> (<a href="https://github.com/bharathreddy55/GateLabs" color="{LINK_COLOR.hexval()}">link</a>)'
story.append(Paragraph(p2_title, body_style))
story.append(Paragraph('<i>React.js, JavaScript, CSS, Firebase, Gemini API, AI Integration</i>', italic_sub))
story.append(Spacer(1, 2))
story.append(Paragraph('• Developed a comprehensive GATE CS &amp; IT preparation platform featuring topic-wise practice, customizable CBT-style mock tests, performance analytics, and an AI-powered study assistant.', bullet_style))
story.append(Paragraph('• Built configurable mock test workflows with subject selection, question navigation, negative marking, mistake analysis, and an integrated calculator aligned with GATE exam patterns.', bullet_style))
story.append(Paragraph('• Designed modular workflows for topic-wise practice, configurable mock tests, question navigation, scoring, negative marking, and performance analysis.', bullet_style))
story.append(Spacer(1, 6))

# Project 3
p3_title = f'<b>Digital Watermarking System</b> (<a href="https://github.com/bharathreddy55/Digital-Watermarking-Images" color="{LINK_COLOR.hexval()}">link</a>)'
story.append(Paragraph(p3_title, body_style))
story.append(Paragraph('<i>Python, Image Processing, LSB, DCT ,QR Encoding, ML</i>', italic_sub))
story.append(Spacer(1, 2))
story.append(Paragraph('• Implemented a robust digital watermarking framework supporting both LSB-based and DCT-based embedding techniques for securely hiding QR-encoded data inside color images.', bullet_style))
story.append(Paragraph('• Designed end-to-end watermark workflows including QR generation, bit-level encoding, block-wise DCT coefficient manipulation, and image reconstruction with minimal perceptual distortion.', bullet_style))
story.append(Paragraph('• Evaluated watermark quality using PSNR and tested extraction robustness under compression, noise, and format transformations.', bullet_style))
story.append(Spacer(1, 8))

# SKILLS
add_heading("SKILLS")
skills_data = [
    "• <b>Programming Languages</b>: Java, JavaScript, SQL, Python(basics)",
    "• <b>Core Java</b>: OOP, Collections Framework, Exception Handling, Stream API",
    "• <b>Frontend Technologies</b>: HTML5, CSS3, JavaScript, Bootstrap, React.js",
    "• <b>Backend &amp; Framework</b>: Spring Framework, Node.js, Express.js",
    "• <b>Database</b>: MySQL, PostgreSQL, MongoDB",
    "• <b>Currently Learning</b>: Spring Boot, RESTful API’s, Multithreading",
    "• <b>Relevant Coursework</b>: Data Structures &amp; Algorithms, Database Management, Operating Systems",
    "• <b>Version Control &amp; Tools</b>: Git, GitHub"
]
for s in skills_data:
    story.append(Paragraph(s, ParagraphStyle('SkillLine', parent=body_style, fontSize=9, leading=12.5, spaceAfter=2)))
story.append(Spacer(1, 8))

# EDUCATION
add_heading("EDUCATION")

edu1_left = Paragraph("• <b>Vellore Institute of Technology</b><br/>B. Tech in Computer Science (Specialization: Information Security), <b>8.39/10 CGPA</b>", body_style)
edu1_right = Paragraph("2022 – 2026<br/>Vellore, Tamil Nadu", ParagraphStyle('RightText', parent=body_style, alignment=2))

edu2_left = Paragraph("• <b>Narayana Junior College</b><br/>Class 12(State Board), <b>92.2%</b> Higher Secondary", body_style)
edu2_right = Paragraph("2020 – 2022<br/>Nellore, Andhra Pradesh", ParagraphStyle('RightText', parent=body_style, alignment=2))

edu3_left = Paragraph("• <b>Narayana High School</b><br/>Class 10(State Board), <b>99.5 %</b>", body_style)
edu3_right = Paragraph("2019 – 2020<br/>Nellore, Andhra Pradesh", ParagraphStyle('RightText', parent=body_style, alignment=2))

t_data = [
    [edu1_left, edu1_right],
    [Spacer(1, 4), Spacer(1, 4)],
    [edu2_left, edu2_right],
    [Spacer(1, 4), Spacer(1, 4)],
    [edu3_left, edu3_right]
]

t = Table(t_data, colWidths=[380, 160])
t.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(t)
story.append(Spacer(1, 8))

# CERTIFICATES AND TRAINING
add_heading("CERTIFICATES AND TRAINING")
cert_left = Paragraph(f'<b>Oracle OCI Generative AI Professional</b> -- Oracle | 2025 | Credential (<a href="https://mylearn.oracle.com/ou/learning-path/oracle-cloud-infrastructure-2025-certified-generative-ai-professional/141094" color="{LINK_COLOR.hexval()}">link</a>)', body_style)
cert_right = Paragraph("May 2025 – June 2025", ParagraphStyle('RightTextCert', parent=body_style, alignment=2))
cert_table = Table([[cert_left, cert_right]], colWidths=[400, 140])
cert_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(cert_table)

doc.build(story)

# Copy to nice one/ directory as well
import shutil
if os.path.exists("nice one"):
    shutil.copy("Bharath_Kumar_Reddy_Resume.pdf", "nice one/Bharath_Kumar_Reddy_Resume.pdf")

print("PDF successfully generated and placed!")
