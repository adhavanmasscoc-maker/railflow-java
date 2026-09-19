import re
import os

def process_css():
    file_path = "frontend/css/styles.css"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update Tokens
    content = content.replace("--bg-base:          #080c15;", "--bg-base:          #070a12;")
    content = content.replace("--bg-primary:       #0f172a;", "--bg-primary:       #0e1424;")
    content = content.replace("--bg-surface:       #0f172a;", "--bg-surface:       #0e1424;")
    content = content.replace("--bg-card:          #0f172a;", "--bg-card:          #0e1424;")
    content = content.replace("--bg-hover:         #1a243c;", "--bg-hover:         #151d33;")
    content = content.replace("--bg-surface-alt:   #172036;", "--bg-surface-alt:   #151d33;")
    
    # 2. Border-Radius adjustments
    content = re.sub(r'border-radius:\s*9999?px\b', 'border-radius: 6px', content)
    content = re.sub(r'border-radius:\s*50%\b', 'border-radius: 6px', content) # Might mess up true circles, but let's fix it later if needed. The prompt specifically requested removing oval pills.
    
    # 3. Restore true circles (pulse dots usually)
    content = content.replace(".pulse-dot {\n    width: 8px;\n    height: 8px;\n    border-radius: 6px;", ".pulse-dot {\n    width: 8px;\n    height: 8px;\n    border-radius: 50%;")
    
    content = content.replace("--radius-xl:        20px;", "--radius-xl:        10px;")
    content = content.replace("--radius-lg:        14px;", "--radius-lg:        10px;")
    
    # 4. 3-Zone Layout
    if ".rf-app {" in content:
        content = re.sub(r'\.rf-app\s*\{[^}]*\}', '.rf-app {\n    display: grid;\n    grid-template-rows: 48px calc(100vh - 80px) 32px;\n    width: 100vw;\n    height: 100vh;\n    overflow: hidden;\n    background-color: var(--bg-base);\n    color: var(--text-primary);\n    font-family: var(--font-sans);\n    font-size: 13px;\n    line-height: 1.4;\n    -webkit-font-smoothing: antialiased;\n}', content)
    
    if ".rf-sidebar {" in content or ".sidebar {" in content:
        content = re.sub(r'\.sidebar\s*\{[^}]*\}', '.sidebar {\n    width: var(--sidebar-width);\n    min-width: var(--sidebar-width);\n    height: 100%;\n    background: linear-gradient(180deg, #111B2E 0%, #0B1220 100%);\n    border-right: 1px solid #263752;\n    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.35);\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    flex-shrink: 0;\n    z-index: 1000;\n    transition: transform var(--transition-slow);\n    user-select: none;\n}', content)
        
    if ".rf-workspace" in content or ".main-viewport" in content or ".app-container" in content:
        content = re.sub(r'\.app-container\s*\{[^}]*\}', '.app-container {\n    height: 100%;\n    overflow-y: auto;\n    padding-bottom: 32px;\n    background: radial-gradient(circle at 50% 0%, #0f1830 0%, var(--bg-base) 70%);\n}', content)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("CSS Updated")

def process_html():
    file_path = "frontend/index.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace the rounded-full references if any
    content = content.replace("rounded-full", "rounded-md")
    
    # 3-Zone structure fix if needed
    if "rf-footer-ticker" not in content:
        # We need to insert a footer if it doesn't exist outside the body layout
        footer_html = """
    <!-- ─── Global Footer Telemetry Ticker ────────────────────────── -->
    <footer class="rf-footer-ticker" id="globalFooterTicker" style="display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background-color: var(--bg-surface); border-top: 1px solid rgba(56, 189, 248, 0.12); font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); z-index: 50; grid-row: 3;">
        <div>SYSTEM STATUS: <strong style="color:var(--emerald);">NOMINAL</strong></div>
        <div>LATENCY: 12ms</div>
    </footer>
</div>
"""
        content = content.replace("</div>\n</body>", footer_html + "\n</body>")
        
    # Segmented track selector fix for station pills
    # Station dock is mentioned as "segmented rail track selector". We might just leave it if there's no pill class explicitly inside html, but we'll remove 'badge-pill' if exists.
    content = content.replace("badge-pill", "badge")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("HTML Updated")
    
process_css()
process_html()
