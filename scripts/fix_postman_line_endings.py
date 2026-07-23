from pathlib import Path

root = Path(r"C:/Users/nizar/OneDrive/Dokumen/Loundryku/postman/collections/Loundryku Admin")
for path in root.rglob("*.request.yaml"):
    txt = path.read_text(encoding="utf-8")
    txt = txt.replace("\r\r\n", "\r\n").replace("\r\n", "\n")
    path.write_text(txt, encoding="utf-8", newline="\n")
    print(f"fixed {path}")
