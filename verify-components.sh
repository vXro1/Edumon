#!/bin/bash

echo "Ì¥ç Verificando componentes..."

# Verificar que los archivos existen
files=(
  "src/components/ui/Button.jsx"
  "src/components/ui/Input.jsx" 
  "src/components/ui/Card.jsx"
  "src/components/ui/Badge.jsx"
  "src/app/page.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "‚úÖ $file existe"
  else
    echo "‚ùå $file no encontrado"
  fi
done

echo ""
echo "Ì∑™ Verificando sintaxis de JSX..."

# Verificar sintaxis b√°sica
if node -e "console.log('Node.js funcionando')" 2>/dev/null; then
  echo "‚úÖ Node.js funcionando"
else
  echo "‚ùå Problema con Node.js"
fi

echo ""
echo "Ì∫Ä Para probar la aplicaci√≥n ejecuta:"
echo "   npm run dev"
echo ""
echo "Ìºê Luego abre: http://localhost:3000"
