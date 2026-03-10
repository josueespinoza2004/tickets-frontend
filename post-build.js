#!/usr/bin/env node

/**
 * Script post-build para copiar archivos necesarios a la carpeta out
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Ejecutando post-build...\n');

const sourceHtaccess = path.join(__dirname, '.htaccess');
const destHtaccess = path.join(__dirname, 'out', '.htaccess');

// Copiar .htaccess a out/
if (fs.existsSync(sourceHtaccess)) {
  try {
    fs.copyFileSync(sourceHtaccess, destHtaccess);
    console.log('✅ .htaccess copiado a out/');
  } catch (error) {
    console.error('❌ Error al copiar .htaccess:', error.message);
    process.exit(1);
  }
} else {
  console.error('❌ .htaccess no encontrado en tickets-frontend/');
  process.exit(1);
}

console.log('✅ Post-build completado\n');
