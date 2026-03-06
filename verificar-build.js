#!/usr/bin/env node

/**
 * Script de verificación del build de Next.js
 * Ejecutar después de npm run build para verificar que todo está correcto
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando build de Next.js...\n');

const outDir = path.join(__dirname, 'out');
const errors = [];
const warnings = [];

// 1. Verificar que existe la carpeta out
if (!fs.existsSync(outDir)) {
  errors.push('❌ La carpeta "out" no existe. Ejecuta "npm run build" primero.');
} else {
  console.log('✅ Carpeta "out" encontrada');
}

// 2. Verificar archivos críticos
const criticalFiles = [
  'index.html',
  'coopefacsa.png',
  '.htaccess'
];

criticalFiles.forEach(file => {
  const filePath = path.join(outDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} encontrado`);
  } else {
    if (file === '.htaccess') {
      warnings.push(`⚠️  ${file} no encontrado - Debes copiarlo manualmente desde tickets-frontend/.htaccess`);
    } else {
      errors.push(`❌ ${file} no encontrado`);
    }
  }
});

// 3. Verificar carpeta _next
const nextDir = path.join(outDir, '_next');
if (fs.existsSync(nextDir)) {
  console.log('✅ Carpeta "_next" encontrada');
  
  // Verificar que hay archivos JavaScript
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log('✅ Carpeta "_next/static" encontrada');
  } else {
    errors.push('❌ Carpeta "_next/static" no encontrada');
  }
} else {
  errors.push('❌ Carpeta "_next" no encontrada');
}

// 4. Verificar index.html contiene las rutas correctas
const indexPath = path.join(outDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  if (indexContent.includes('/tickets/_next/')) {
    console.log('✅ index.html contiene rutas con basePath correcto (/tickets/)');
  } else {
    warnings.push('⚠️  index.html no contiene "/tickets/_next/" - verifica la configuración de basePath');
  }
  
  if (indexContent.includes('NEXT_PUBLIC_API_URL')) {
    warnings.push('⚠️  index.html contiene variables de entorno sin reemplazar');
  }
}

// 5. Verificar .env.production
const envProdPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envProdPath)) {
  const envContent = fs.readFileSync(envProdPath, 'utf-8');
  if (envContent.includes('https://coopefacsa.coop.ni/tickets-backend')) {
    console.log('✅ .env.production configurado correctamente');
  } else {
    warnings.push('⚠️  .env.production no contiene la URL correcta de producción');
  }
} else {
  errors.push('❌ .env.production no encontrado');
}

// 6. Verificar que .htaccess existe en la raíz del proyecto
const htaccessSource = path.join(__dirname, '.htaccess');
if (fs.existsSync(htaccessSource)) {
  console.log('✅ .htaccess encontrado en tickets-frontend/');
} else {
  errors.push('❌ .htaccess no encontrado en tickets-frontend/');
}

// Resumen
console.log('\n' + '='.repeat(60));
console.log('RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60) + '\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 ¡Todo está correcto! El build está listo para producción.\n');
  console.log('📦 Pasos siguientes:');
  console.log('   1. Copia TODO el contenido de la carpeta "out/" a /tickets/ en tu servidor');
  console.log('   2. Copia el archivo .htaccess a /tickets/.htaccess en tu servidor');
  console.log('   3. Limpia el caché del navegador (Ctrl + Shift + Delete)');
  console.log('   4. Prueba en https://coopefacsa.coop.ni/tickets/\n');
} else {
  if (errors.length > 0) {
    console.log('❌ ERRORES ENCONTRADOS:\n');
    errors.forEach(err => console.log('   ' + err));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  ADVERTENCIAS:\n');
    warnings.forEach(warn => console.log('   ' + warn));
    console.log('');
  }
  
  console.log('Por favor, corrige los errores antes de desplegar a producción.\n');
}

console.log('='.repeat(60) + '\n');
