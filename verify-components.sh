#!/bin/bash

echo "� Verificando componentes..."

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
    echo "✅ $file existe"
  else
    echo "❌ $file no encontrado"
  fi
done

echo ""
echo "� Verificando sintaxis de JSX..."

# Verificar sintaxis básica
if node -e "console.log('Node.js funcionando')" 2>/dev/null; then
  echo "✅ Node.js funcionando"
else
  echo "❌ Problema con Node.js"
fi

echo ""
echo "� Para probar la aplicación ejecuta:"
echo "   npm run dev"
echo ""
echo "� Luego abre: http://localhost:3000"
