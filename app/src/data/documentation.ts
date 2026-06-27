import type { DocEntry } from '../types/labedo';

export const documentationEntries: DocEntry[] = [
  // ─── MALWARE ────────────────────────────────────────────────────────────────

  {
    id: 'doc_worm',
    title: 'Worm',
    category: 'malware',
    summary: 'Malware autorreplicante de alta propagación. Se multiplica exponencialmente.',
    tags: ['#HighSpread', '#Critical', '#Multiplica', '#Exponencial'],
    sections: [
      { 
        title: '🦠 Definición y características', 
        content: 'El Worm (gusano) es un malware autorreplicante que se propaga automáticamente entre sistemas conectados sin necesidad de interacción del usuario.\n\nCaracterísticas principales:\n• No necesita archivo anfitrión (a diferencia de los virus)\n• Se propaga por red utilizando vulnerabilidades\n• Puede consumir ancho de banda y recursos del sistema\n• Puede transportar cargas maliciosas (payloads)\n• Se multiplica exponencialmente: nodos pequeños → ×2, nodos grandes (servidores, routers) → ×4\n\nTiempo de propagación: Extremadamente rápido (minutos)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 1.8\n🔄 γ (Tasa de recuperación): 0.3\n📊 R₀ (Número básico de reproducción): 6.0\n\n📊 Métricas de comportamiento:\n• Infectividad: ★★★★★ (5/5) — Muy alto\n• Sigilo: ★★☆☆☆ (2/5) — Bajo (visible)\n• Daño: ★★★☆☆ (3/5) — Medio\n\n⏱️ Tiempo de backup recomendado: 6 segundos' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Multiplicación:\n• Nodos pequeños (PC, IoT, PLC) → infectan 2 nodos por ciclo\n• Nodos grandes (Servidores, Routers, Cloud) → infectan 4 nodos por ciclo\n• La propagación se acelera exponencialmente mientras más nodos infectados hay\n\n📌 Vectores de ataque:\n• Escaneo de puertos (Puertos comunes: 445, 139, 22, 80, 443)\n• Explotación de vulnerabilidades (EternalBlue, SMB, RDP)\n• Propagación por email y redes compartidas\n• Uso de credenciales débiles o por defecto\n\n📌 Comportamiento en la red:\n• Tráfico anómalo de red (muchas conexiones salientes)\n• Consumo elevado de CPU y ancho de banda\n• Arquitectura: descentralizada (cada nodo infectado busca nuevos objetivos)' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ AISLAR el nodo infectado (arrastrar fuera del centro o doble click derecho)\n2️⃣ CORTAR INTERNET (usar ISOLATION en mitigación global) — ¡CRÍTICO!\n3️⃣ PARCHAR nodos vulnerables (doble click en nodos infectados o vulnerables)\n4️⃣ ESPERAR a que todos los nodos estén VERDES (susceptibles)\n5️⃣ Hacer BACKUP (click en nodos o botón global) → nodos se vuelven AZULES\n6️⃣ REABRIR INTERNET (desactivar ISOLATION)\n\n⚠️ Si no se corta internet a tiempo, el worm infecta toda la red en minutos.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• FIREWALL — Bloquea conexiones entrantes/salientes sospechosas\n• AISLAMIENTO — Corta la propagación (β × 0.60)\n• IDS/IPS — Detecta tráfico anómalo y patrones de gusano\n\n❌ EVITAR (contraproducentes):\n• BACKUP — Durante brote activo, puede propagar el gusano\n• PATCH — Retrasa la contención mientras el gusano sigue activo' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Fórmulas de propagación:\n• Nodos pequeños: spreadCount = 2, chance = 0.08\n• Nodos grandes: spreadCount = 4, chance = 0.12\n• Firewall reduce chance a 30% de su valor original\n\n💻 Fragmento de código (TypeScript):\nfunction stepWorm(nodes, dt, mit) {\n  const adj = buildAdj(nodes);\n  const infected = nodes.filter(n => n.state === "infected");\n  const toInfect = new Set();\n  \n  infected.forEach(node => {\n    const neighbors = getNeighbors(node, adj);\n    const isLarge = ["server","database","router","cloud"].includes(node.type);\n    const spreadCount = isLarge ? 4 : 2;\n    const chance = isLarge ? 0.12 : 0.08;\n    \n    // Propagación con mitigaciones\n    const effectiveChance = mit.firewall ? chance * 0.3 : chance;\n    for (const nb of neighbors) {\n      if (Math.random() < effectiveChance) {\n        toInfect.add(nb.id);\n      }\n    }\n  });\n  \n  return nodes.map(n => toInfect.has(n.id) \n    ? { ...n, state: "infected" } \n    : n);\n}' 
      },
    ],
  },
  {
    id: 'doc_ransomware',
    title: 'Ransomware',
    category: 'malware',
    summary: 'Cifra archivos y mata nodos. Irrecuperable si no se actúa rápido.',
    tags: ['#Critical', '#KillsNodes', '#Slow', '#Encryption'],
    sections: [
      { 
        title: '🔒 Definición y características', 
        content: 'El Ransomware es el malware más peligroso en LAB-EDO. Cifra archivos críticos y exige rescate. Los nodos infectados mueren después de 20 segundos reales si no se tratan a tiempo.\n\nCaracterísticas principales:\n• Cifrado de archivos (AES-256, RSA)\n• Nodos muertos (💀) son IRRECUPERABLES\n• Exige rescate en criptomonedas\n• Se propaga UNO POR UNO (lento pero letal)\n• Requiere MÚLTIPLES backups (2-4 por nodo)\n\nTiempo de propagación: Lento (10-20 segundos por nodo)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 1.2\n🔄 γ (Tasa de recuperación): 0.15\n📊 R₀ (Número básico de reproducción): 8.0\n\n📊 Métricas de comportamiento:\n• Infectividad: ★★★☆☆ (3/5) — Media\n• Sigilo: ★★★☆☆ (3/5) — Medio\n• Daño: ★★★★★ (5/5) — Máximo\n\n⏱️ Tiempo de backup recomendado: 10 segundos\n💀 Umbral de muerte: 20 segundos reales' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Ciclo de vida:\n1. Infecta un nodo UNO POR UNO (lento)\n2. El nodo permanece infectado durante 20 segundos reales\n3. Si no se trata: el nodo MUERE (💀 irrecuperable)\n4. El ransomware busca nuevos objetivos\n\n📌 Vectores de ataque:\n• Phishing (correos con enlaces maliciosos)\n• Vulnerabilidades en servicios expuestos (RDP, SMB)\n• Descargas automáticas (drive-by downloads)\n• Explotación de credenciales débiles\n\n📌 Comportamiento en la red:\n• Tráfico de red: bajo (propagación lenta)\n• Alto consumo de CPU (cifrado de archivos)\n• Nodos muertos: no se pueden recuperar, ni con backup' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ DETECTAR INTRUSO (encontrar el nodo origen) — ¡URGENTE!\n2️⃣ AISLAR el nodo origen inmediatamente (doble click derecho)\n3️⃣ PARCHAR el nodo origen (doble click izquierdo)\n4️⃣ Hacer BACKUP REPETIDAMENTE al nodo (2-4 veces)\n5️⃣ Los nodos se recuperan LENTAMENTE (10s de backup cada uno)\n6️⃣ Si un nodo muere (💀): NO SE PUEDE RECUPERAR\n\n⚠️ El tiempo es crítico: tienes 20 segundos reales por nodo infectado.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• BACKUP — CRÍTICO (requiere 2-4 aplicaciones por nodo)\n• AISLAMIENTO — Detiene la propagación\n• PATCH — Cierra vulnerabilidades\n\n❌ EVITAR (contraproducentes):\n• IDS/IPS — No detiene el cifrado (ya está dentro)\n• FIREWALL — No protege contra ransomware interno\n\n⚠️ IMPORTANTE: Un solo backup NO es suficiente contra ransomware.' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Parámetros de muerte:\n• Umbral de muerte: 20 segundos reales\n• Probabilidad de descifrado: 0.8% por segundo real (muy lento)\n• Backups necesarios: 2-4 por nodo infectado\n• Tasa de recuperación efectiva: γ_eff = γ × 0.3 durante el ataque\n\n💻 Fragmento de código (TypeScript):\nfunction stepRansomware(nodes, realDt, mit) {\n  const infected = nodes.filter(n => n.state === "infected");\n  \n  infected.forEach(node => {\n    const infectedTime = (node.infectedTime ?? 0) + realDt;\n    if (infectedTime >= 20) {\n      // Nodo muere (irrecuperable)\n      node.state = "dead";\n      node.isDead = true;\n      addLog(`💀 ${node.name} ha muerto por ransomware`);\n    }\n  });\n  \n  // Propagación lenta: un nodo cada vez\n  const vulnerable = nodes.filter(n => n.vulnerable && n.state === "susceptible");\n  if (vulnerable.length > 0 && Math.random() < 0.025) {\n    const target = vulnerable[Math.floor(Math.random() * vulnerable.length)];\n    target.state = "infected";\n    target.infectedTime = 0;\n  }\n}' 
      },
    ],
  },
  {
    id: 'doc_trojan',
    title: 'Trojan',
    category: 'malware',
    summary: 'Se oculta en nodos. Solo se revela con escaneo. Se mueve cada 3s.',
    tags: ['#Stealth', '#Hidden', '#Moving'],
    sections: [
      { 
        title: '🐴 Definición y características', 
        content: 'El Troyano es un malware que se oculta en nodos sin ser detectado. Se mueve cada 3-5 segundos reales, dejando el nodo infectado al moverse.\n\nCaracterísticas principales:\n• Se oculta en nodos (NO visible sin escaneo)\n• Se mueve cada 3-5 segundos reales\n• Deja el nodo infectado (rojo) al moverse\n• Solo se revela con ESCANEO o IDS\n• IDS tiene 8% de probabilidad de detectarlo por segundo\n\nTiempo de propagación: Moderado (se mueve constantemente)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 0.9\n🔄 γ (Tasa de recuperación): 0.4\n📊 R₀ (Número básico de reproducción): 2.25\n\n📊 Métricas de comportamiento:\n• Infectividad: ★★☆☆☆ (2/5) — Baja\n• Sigilo: ★★★★★ (5/5) — Máximo\n• Daño: ★★★☆☆ (3/5) — Medio\n\n⏱️ Tiempo de backup recomendado: 5 segundos\n🔄 Intervalo de movimiento: 3-5 segundos reales' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Ciclo de vida:\n1. Aparece en un nodo (OCULTO, no se ve)\n2. Permanece 3-5 segundos reales\n3. Al moverse: DEJA EL NODO INFECTADO (rojo)\n4. Busca un nuevo nodo susceptible\n5. Si no se detecta, continúa infectando la red\n\n📌 Métodos de detección:\n• ESCANEO — Revela el troyano en el nodo\n• IDS — 8% de probabilidad de detección por segundo\n\n📌 Comportamiento en la red:\n• Tráfico intermitente y sospechoso\n• Nodos que se infectan sin causa aparente\n• El troyano nunca se muestra hasta que se escanea' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ ACTIVAR ESCANEO (botón global de mitigación) — ¡CRÍTICO!\n2️⃣ ESCANEAR nodos sospechosos (click derecho en nodos)\n3️⃣ Cuando se detecta: AISLAR el nodo (doble click derecho)\n4️⃣ PARCHAR el nodo (doble click izquierdo)\n5️⃣ Hacer BACKUP a todos los DEMÁS nodos (click izquierdo)\n6️⃣ El nodo aislado quedará VERDE (más vulnerable) — hacerle backup por separado\n\n⚠️ Si no escaneas a tiempo, el troyano infecta muchos nodos.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• IDS/IPS — Detecta actividad sospechosa (8% por segundo)\n• ESCANEO — Revela el troyano oculto\n• FIREWALL — Bloquea comunicación C2\n\n❌ EVITAR (contraproducentes):\n• BACKUP — Durante movimiento, puede propagar el troyano\n• AISLAMIENTO prematuro — Puede mover el troyano a otro nodo' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Parámetros de movimiento:\n• Probabilidad de aparición: 5% por tick de simulación\n• Tiempo de movimiento: 3-5 segundos (aleatorio)\n• Probabilidad de detección por IDS: 8% por segundo real\n• El nodo infectado se marca con flag "isTrojan": true\n\n💻 Fragmento de código (TypeScript):\nfunction stepTrojan(nodes, realDt, state) {\n  let { trojanNodeId, trojanTimer } = state;\n  \n  // Movimiento en tiempo real (segundos reales)\n  trojanTimer += realDt;\n  \n  if (!trojanNodeId) {\n    // Aparecer en nodo aleatorio (5% de probabilidad)\n    const candidates = nodes.filter(n => n.state === "susceptible");\n    if (candidates.length > 0 && Math.random() < 0.05) {\n      const target = candidates[Math.floor(Math.random() * candidates.length)];\n      target.isTrojan = true;\n      trojanNodeId = target.id;\n      trojanTimer = 0;\n    }\n  } else if (trojanTimer >= 3 + Math.random() * 2) {\n    // Moverse: infectar nodo actual y buscar nuevo\n    const current = nodes.find(n => n.id === trojanNodeId);\n    if (current && !current.isPatched) {\n      current.state = "infected";\n      current.isTrojan = false;\n      // Buscar nuevo nodo\n      const next = findNextSusceptible(nodes);\n      if (next) {\n        next.isTrojan = true;\n        trojanNodeId = next.id;\n      }\n    }\n    trojanTimer = 0;\n  }\n}' 
      },
    ],
  },
  {
    id: 'doc_botnet',
    title: 'Botnet',
    category: 'malware',
    summary: 'Crea una telaraña de nodos infectados alrededor de un nodo madre.',
    tags: ['#SpiderWeb', '#MotherNode', '#DDoS'],
    sections: [
      { 
        title: '🕸️ Definición y características', 
        content: 'La Botnet crea una red de dispositivos comprometidos controlados remotamente. Se expande como una telaraña desde un NODO MADRE.\n\nCaracterísticas principales:\n• NODO MADRE (el que controla la red)\n• Crea nodos infectados ALREDEDOR como telaraña\n• Se expande en CÍRCULOS CONCÉNTRICOS\n• Se ve en el MOVIMIENTO DE DATOS (tráfico anómalo)\n• Puede lanzar ataques DDoS\n\nTiempo de propagación: Medio (expansión en círculos)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 1.5\n🔄 γ (Tasa de recuperación): 0.25\n📊 R₀ (Número básico de reproducción): 6.0\n\n📊 Métricas de comportamiento:\n• Infectividad: ★★★★☆ (4/5) — Alta\n• Sigilo: ★★★☆☆ (3/5) — Medio\n• Daño: ★★★★☆ (4/5) — Alto\n\n⏱️ Tiempo de backup recomendado: 7 segundos' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Estructura:\n• NODO MADRE: punto central que controla la botnet\n• Capa 1: nodos directamente conectados al madre\n• Capa 2: nodos conectados a la capa 1\n• Cada capa se expande como telaraña\n\n📌 Propagación:\n• El nodo madre infecta nodos conectados (capa 1)\n• Los nodos de capa 1 infectan nodos de capa 2\n• Así sucesivamente hasta cubrir la red\n\n📌 Comportamiento en la red:\n• Tráfico de red: patrón de telaraña\n• Nodos madre: se marcan con "isBotnetHub"\n• Nodos infectados: se marcan con "isBotnetInfected"' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ DETECTAR INTRUSO (identificar nodo madre)\n2️⃣ AISLAR el nodo madre (doble click derecho) — ¡URGENTE!\n3️⃣ AISLAR nodos cercanos al nodo madre\n4️⃣ CURAR nodos uno por uno hasta que estén VERDES\n5️⃣ Hacer BACKUP para volverlos AZULES\n\n⚠️ Si no aislás el nodo madre, la telaraña llega a otros nodos.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• IDS/IPS — Detecta patrones de botnet\n• AISLAMIENTO — Detiene la expansión\n• FIREWALL — Bloquea comunicación C2\n\n❌ EVITAR (contraproducentes):\n• BACKUP — Puede acelerar la propagación\n• PATCH — No detiene la red de bots activa' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Parámetros de expansión:\n• Probabilidad de expansión: 4-10% por tick\n• IDS reduce a 4%, Firewall a 6%, sin mitigación 10%\n• Nodos madre: isBotnetHub = true\n• Nodos infectados: isBotnetInfected = true\n\n💻 Fragmento de código (TypeScript):\nfunction stepBotnet(nodes, dt, mit) {\n  const hub = nodes.find(n => n.isBotnetHub);\n  if (!hub) return;\n  \n  const chance = mit.ids ? 0.04 : mit.firewall ? 0.06 : 0.10;\n  const toInfect = new Set();\n  \n  // Infectar nodos conectados al hub\n  hub.connections.forEach(connId => {\n    const neighbor = nodes.find(n => n.id === connId);\n    if (neighbor?.state === "susceptible" && Math.random() < chance) {\n      toInfect.add(neighbor.id);\n    }\n  });\n  \n  // Infectar nodos desde nodos infectados (telaraña)\n  nodes.filter(n => n.isBotnetInfected).forEach(node => {\n    node.connections.forEach(connId => {\n      const neighbor = nodes.find(n => n.id === connId);\n      if (neighbor?.state === "susceptible" && Math.random() < 0.06) {\n        toInfect.add(neighbor.id);\n      }\n    });\n  });\n}' 
      },
    ],
  },
  {
    id: 'doc_rootkit',
    title: 'Rootkit',
    category: 'malware',
    summary: 'No se ve con detección de intrusos. Hay que escanear nodo por nodo.',
    tags: ['#Stealth', '#HiddenNetwork', '#Kernel'],
    sections: [
      { 
        title: '👁️ Definición y características', 
        content: 'El Rootkit es un malware de ocultación avanzada. Opera a nivel de kernel del sistema operativo y oculta completamente su presencia.\n\nCaracterísticas principales:\n• NO se ve con "Detectar intruso"\n• Hay que ESCANEAR nodo por nodo\n• Cuando lo encuentras, se REVELA TODA LA RED oculta\n• Ya tiene una red de nodos infectados creada previamente\n• Opera a nivel de kernel (muy difícil de detectar)\n\nTiempo de propagación: Lento (se oculta para no ser detectado)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 0.7\n🔄 γ (Tasa de recuperación): 0.2\n📊 R₀ (Número básico de reproducción): 3.5\n\n📊 Métricas de comportamiento:\n• Infectividad: ★★☆☆☆ (2/5) — Baja\n• Sigilo: ★★★★★ (5/5) — Máximo\n• Daño: ★★★★☆ (4/5) — Alto\n\n⏱️ Tiempo de backup recomendado: 8 segundos' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Ocultación:\n• Los nodos infectados se marcan con "isRootkitHidden": true\n• Parecen nodos susceptibles (verdes) visualmente\n• No se ven en estadísticas de infección\n\n📌 Revelación:\n• Al escanear un nodo infectado, se revela\n• Se revela TODA la red oculta del rootkit\n• Los nodos ocultos aparecen como infectados (rojos)\n\n📌 Comportamiento en la red:\n• No hay tráfico sospechoso visible\n• Los nodos infectados parecen normales\n• El rootkit se oculta en el kernel del sistema' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ ACTIVAR ESCANEO (botón global de mitigación)\n2️⃣ ESCANEAR nodo por nodo (click derecho) hasta encontrar el rootkit\n3️⃣ Cuando se encuentra: se revelan TODOS los nodos infectados\n4️⃣ AISLAR todos los nodos infectados (doble click derecho)\n5️⃣ PARCHAR el nodo raíz (doble click izquierdo)\n6️⃣ Hacer BACKUP a todos los nodos (click izquierdo)\n\n⚠️ Es difícil de encontrar. Mientras buscas, se propaga en silencio.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• PATCH — Cierra la vulnerabilidad del kernel\n• IDS/IPS — Detecta comportamiento anómalo\n• ESCANEO — Encuentra el rootkit oculto\n\n❌ EVITAR (contraproducentes):\n• FIREWALL — No elimina rootkits (está dentro del sistema)\n• BACKUP — Puede restaurar el rootkit si se hace sin limpiar' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Parámetros de ocultación:\n• Nodos infectados se ocultan con "isRootkitHidden": true\n• Al escanear: "isRootkitHidden": false\n• Probabilidad de propagación oculta: 5% por tick\n• Revela toda la red al encontrar el nodo raíz\n\n💻 Fragmento de código (TypeScript):\nfunction stepRootkit(nodes, dt, rootkitFoundId) {\n  // Ocultar nodos infectados\n  nodes = nodes.map(n => {\n    if (n.state === "infected" && !n.isRootkitHidden && n.id !== rootkitFoundId) {\n      return { ...n, isRootkitHidden: true };\n    }\n    return n;\n  });\n  \n  // Propagación oculta\n  const hiddenInfected = nodes.filter(n => n.isRootkitHidden);\n  hiddenInfected.forEach(node => {\n    if (Math.random() < 0.05) {\n      // Infectar nodo vecino y ocultarlo\n      const neighbor = findSusceptibleNeighbor(node);\n      if (neighbor) {\n        neighbor.state = "infected";\n        neighbor.isRootkitHidden = true;\n      }\n    }\n  });\n  \n  // Revelar red cuando se encuentra el rootkit\n  if (rootkitFoundId) {\n    nodes = nodes.map(n => ({\n      ...n,\n      isRootkitHidden: n.isRootkitHidden ? false : n.isRootkitHidden\n    }));\n  }\n}' 
      },
    ],
  },
  {
    id: 'doc_spyware',
    title: 'Spyware',
    category: 'malware',
    summary: 'Infecta uno por uno y roba información. Apaga nodos y corta internet.',
    tags: ['#Exfiltration', '#KillsNodes', '#DataTheft'],
    sections: [
      { 
        title: '📡 Definición y características', 
        content: 'El Spyware recolecta información confidencial sin consentimiento. Infecta uno por uno, roba datos y eventualmente apaga nodos y corta internet.\n\nCaracterísticas principales:\n• Infecta UNO POR UNO (lento pero persistente)\n• Mientras infecta: ROBA INFORMACIÓN (exfiltración)\n• Después de 30 SEGUNDOS REALES: apaga el nodo\n• Si no se detiene: CORTA EL INTERNET\n• Se detecta con "Detectar intruso"\n\nTiempo de propagación: Lento (exfiltración de datos)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 0.6\n🔄 γ (Tasa de recuperación): 0.5\n📊 R₀ (Número básico de reproducción): 1.2\n\n📊 Métricas de comportamiento:\n• Infectividad: ★★☆☆☆ (2/5) — Baja\n• Sigilo: ★★★★☆ (4/5) — Alto\n• Daño: ★★☆☆☆ (2/5) — Bajo\n\n⏱️ Tiempo de backup recomendado: 4 segundos\n💀 Umbral de muerte: 30 segundos reales' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Ciclo de vida:\n1. Infecta un nodo UNO POR UNO\n2. Exfiltra datos durante 8-12 segundos reales\n3. Se mueve a otro nodo (deja el nodo infectado)\n4. Si no se detiene: apaga el nodo (30s reales)\n5. Si se propaga demasiado: CORTA EL INTERNET\n\n📌 Exfiltración de datos:\n• Robo de información confidencial\n• Firewall + IDS bloquean exfiltración al 100%\n\n📌 Comportamiento en la red:\n• Tráfico de datos saliente anómalo\n• Nodos que se apagan misteriosamente' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ DETECTAR INTRUSO (aparece en un nodo)\n2️⃣ AISLAR DEL INTERNET (usar ISOLATION global) — ¡CRÍTICO!\n3️⃣ AUMENTAR FIREWALL (bloquear exfiltración)\n4️⃣ RECUPERAR DATOS (nodos se ponen verdes)\n5️⃣ Hacer BACKUP (nodos se ponen azules)\n\n⚠️ Si no aislás a tiempo, el spyware apaga nodos y corta internet.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• FIREWALL — Bloquea exfiltración de datos\n• IDS/IPS — Detecta tráfico sospechoso\n• AISLAMIENTO — Corta comunicación externa\n\n❌ EVITAR (contraproducentes):\n• BACKUP — No detiene la exfiltración\n• PATCH — No afecta al spyware activo' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Parámetros de exfiltración:\n• Tiempo de exfiltración: 8-12 segundos reales por nodo\n• Muerte del nodo: 30 segundos reales\n• Firewall + IDS bloquean exfiltración al 100%\n• Sin mitigación: se mueve cada 8-12 segundos\n\n💻 Fragmento de código (TypeScript):\nfunction stepSpyware(nodes, realDt, mit) {\n  let spywareNodeId = state.spywareNodeId;\n  let exfilTimer = state.spywareExfilTimer;\n  \n  exfilTimer += realDt;\n  \n  if (!spywareNodeId) {\n    const seed = nodes.find(n => n.state === "infected");\n    if (seed) {\n      spywareNodeId = seed.id;\n      seed.spywareTarget = true;\n    }\n  } else if (exfilTimer > 8 + Math.random() * 4) {\n    // Moverse a otro nodo\n    const current = nodes.find(n => n.id === spywareNodeId);\n    if (current && !(mit.firewall && mit.ids)) {\n      const next = findNextSusceptible(nodes);\n      if (next) {\n        current.spywareTarget = false;\n        next.state = "infected";\n        spywareNodeId = next.id;\n      }\n    }\n    exfilTimer = 0;\n  }\n}' 
      },
    ],
  },
  {
    id: 'doc_adware',
    title: 'Adware',
    category: 'malware',
    summary: 'Satura el tráfico de datos. No infecta, solo ralentiza.',
    tags: ['#LowRisk', '#Traffic', '#Saturation'],
    sections: [
      { 
        title: '📢 Definición y características', 
        content: 'El Adware muestra publicidad no deseada y satura el tráfico de datos. No infecta nodos, solo ralentiza la red y reduce el rendimiento.\n\nCaracterísticas principales:\n• NO infecta nodos\n• SATURA el tráfico de datos\n• Eventualmente el tráfico llega a CERO\n• La red se ralentiza progresivamente\n• Es el malware menos peligroso\n\nTiempo de propagación: N/A (no se propaga, solo satura)' 
      },
      { 
        title: '📊 Parámetros SIR detallados', 
        content: '📈 β (Tasa de infección): 0.4\n🔄 γ (Tasa de recuperación): 0.8\n📊 R₀ (Número básico de reproducción): 0.5\n\n📊 Métricas de comportamiento:\n• Infectividad: ★☆☆☆☆ (1/5) — Muy baja\n• Sigilo: ★★☆☆☆ (2/5) — Baja\n• Daño: ★☆☆☆☆ (1/5) — Muy bajo\n\n⏱️ Tiempo de backup recomendado: 3 segundos' 
      },
      { 
        title: '⚡ Comportamiento y propagación', 
        content: '📌 Comportamiento:\n• NO infecta nodos (no hay nodos rojos)\n• Satura el tráfico de red gradualmente\n• El tráfico puede llegar a 0%\n• La red se vuelve inutilizable\n\n📌 Efectos:\n• Degradación del tráfico: 0.015 unidades por segundo real\n• Firewall reduce la degradación: -0.02 unidades por segundo\n\n📌 Comportamiento en la red:\n• No hay nodos infectados visibles\n• El tráfico de red disminuye progresivamente\n• Los nodos están verdes pero la red no funciona' 
      },
      { 
        title: '🛡️ Estrategia de defensa paso a paso', 
        content: '1️⃣ ACTIVAR FIREWALL (bloquear tráfico publicitario)\n2️⃣ RECUPERAR DATOS (el tráfico vuelve a la normalidad)\n3️⃣ Backup opcional (no es necesario para adware)\n\n⚠️ Si no ponés firewall, el tráfico cae a cero y la red se ralentiza.' 
      },
      { 
        title: '✅ Mitigaciones efectivas', 
        content: '🛡️ RECOMENDADAS:\n• PATCH — Corrige vulnerabilidades del navegador\n• FIREWALL — Bloquea tráfico publicitario\n\n❌ EVITAR (contraproducentes):\n• AISLAMIENTO — Excesivo para adware\n• IDS/IPS — No es necesario (no infecta nodos)' 
      },
      { 
        title: '🧮 Implementación numérica y código', 
        content: '📐 Parámetros de degradación:\n• Degradación del tráfico: 0.015 unidades por segundo real\n• Firewall reduce la degradación: -0.02 unidades por segundo\n• El tráfico se mide en escala 0-1\n• 0 = sin tráfico, 1 = normal\n\n💻 Fragmento de código (TypeScript):\nfunction stepAdware(nodes, realDt, mit) {\n  let trafficDegradation = state.trafficDegradation;\n  \n  const degradeRate = mit.firewall ? -0.02 : 0.015;\n  trafficDegradation = Math.max(0, Math.min(1, \n    trafficDegradation + degradeRate * realDt\n  ));\n  \n  nodes = nodes.map(n => ({\n    ...n,\n    trafficLoad: trafficDegradation\n  }));\n  \n  if (trafficDegradation > 0.9) {\n    addLog(`📢 Adware ha saturado el tráfico al ${trafficDegradation * 100}%`);\n  }\n}' 
      },
    ],
  },

  // ─── INFRAESTRUCTURAS ──────────────────────────────────────────────────────

  {
    id: 'doc_university',
    title: 'Universidad',
    category: 'infrastructure',
    summary: 'Red académica con WiFi abierto y BYOD. ~1200 nodos.',
    tags: ['#BYOD', '#WiFi', '#Académica'],
    sections: [
      { 
        title: '🏫 Descripción general', 
        content: 'Campus universitario con laboratorios, facultades, DMZ y dispositivos IoT. Red abierta con muchos dispositivos personales (BYOD).\n\n📌 Características:\n• Entorno académico con alta rotación de dispositivos\n• WiFi abierto en todo el campus\n• Estudiantes y profesores con dispositivos personales\n• Laboratorios de computación con acceso a internet\n• Sistema de gestión académica y biblioteca digital' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Firewall → Core Switch\n  ├─ DMZ (servidores web, portal académico)\n  ├─ Red de Usuarios (labs, BYOD, WiFi)\n  ├─ Red Corporativa (BD, servidores internos)\n  └─ IoT (sensores de campus, cámaras)\n\n📌 Seguridad: Media (55%)\n📌 Complejidad: Media (45%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ WiFi abierto y sin autenticación fuerte\n2️⃣ BYOD sin políticas de seguridad\n3️⃣ Dispositivos IoT sin parchear\n4️⃣ Usuarios no entrenados en ciberseguridad\n5️⃣ Phishing académico (correos falsos)\n6️⃣ Acceso a recursos compartidos sin control' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 1200\n📌 Complejidad: 45%\n📌 Seguridad: 55%\n📌 Criticidad: 70%\n📌 Umbral de colapso: 80%\n\n📌 Factores de simulación:\n• β base: 1.8 × 1.3 (complejidad) = 2.34\n• γ base: 0.3 × 0.9 (seguridad) = 0.27\n• R₀ efectivo: 8.67' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 1.3 (alta complejidad)\n🔄 Factor de recuperación: 0.9 (seguridad media)\n📊 Modificadores:\n• Worm: β×1.3, γ×0.9\n• Ransomware: β×1.1, γ×0.9\n• Troyano: β×0.9, γ×0.9' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Aislar laboratorios y áreas de BYOD\n2️⃣ Cortar WiFi abierto durante brotes\n3️⃣ Parchear dispositivos IoT (sensores, cámaras)\n4️⃣ Educar a usuarios sobre phishing\n5️⃣ Implementar políticas de seguridad para BYOD' 
      },
    ],
  },
  {
    id: 'doc_hospital',
    title: 'Hospital',
    category: 'infrastructure',
    summary: 'Red clínica con EMR, monitores IoT y equipos médicos legacy. ~800 nodos.',
    tags: ['#Critical', '#Legacy', '#Healthcare'],
    sections: [
      { 
        title: '🏥 Descripción general', 
        content: 'Infraestructura clínica crítica con sistemas EMR (Historia Clínica Electrónica), PACS (Imágenes), farmacia digital y monitores IoT en UCI.\n\n📌 Características:\n• Sistema de salud con datos de pacientes\n• Equipos médicos conectados a la red\n• Monitores de signos vitales en UCI\n• Sistema de farmacia y dispensación de medicamentos\n• Historia clínica electrónica (EMR)' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Firewall → Core\n  ├─ EMR (Historia Clínica)\n  ├─ PACS/Radiología (imágenes médicas)\n  ├─ Farmacia Digital\n  ├─ IoT Médico (monitores UCI)\n  └─ BD de Pacientes\n\n📌 Seguridad: Media-Alta (65%)\n📌 Complejidad: Media-Alta (60%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ Equipos médicos LEGACY sin parches\n2️⃣ IoT médico con firmware obsoleto\n3️⃣ Monitores UCI expuestos a la red\n4️⃣ Sistema de salud crítico (95% criticidad)\n5️⃣ Dispositivos conectados sin autenticación\n6️⃣ Datos de pacientes altamente sensibles' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 800\n📌 Complejidad: 60%\n📌 Seguridad: 65%\n📌 Criticidad: 95%\n📌 Umbral de colapso: 60%\n\n📌 Factores de simulación:\n• β base: 1.2 × 1.1 (complejidad) = 1.32\n• γ base: 0.15 × 1.1 (seguridad) = 0.165\n• R₀ efectivo: 8.0' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 1.1 (complejidad media-alta)\n🔄 Factor de recuperación: 1.1 (seguridad media-alta)\n📊 Modificadores:\n• Ransomware: β×1.1, γ×1.1\n• Worm: β×1.1, γ×1.0\n• Troyano: β×0.8, γ×1.0' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Aislar equipos médicos legacy en subredes separadas\n2️⃣ Monitorear constantemente dispositivos IoT en UCI\n3️⃣ Implementar parches críticos en sistemas EMR\n4️⃣ Backup frecuente de historias clínicas\n5️⃣ Segmentación estricta entre redes clínicas y administrativas' 
      },
    ],
  },
  {
    id: 'doc_datacenter',
    title: 'Datacenter',
    category: 'infrastructure',
    summary: 'Centro de datos con balanceadores, clusters y servicios cloud. ~2000 nodos.',
    tags: ['#Cloud', '#HighSecurity', '#Multi-tenant'],
    sections: [
      { 
        title: '☁️ Descripción general', 
        content: 'Centro de datos moderno con balanceadores de carga, clusters de aplicaciones, bases de datos y servicios cloud.\n\n📌 Características:\n• Alta disponibilidad y redundancia\n• Balanceadores de carga para distribución de tráfico\n• Clusters de servidores para escalabilidad\n• Bases de datos con replicación\n• Servicios cloud y virtualización' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Load Balancer\n  ├─ Web Servers (3 nodos)\n  ├─ App Servers (2 nodos)\n  └─ DB Cluster + Redis Cache + Backup\n\n📌 Seguridad: Alta (80%)\n📌 Complejidad: Media (55%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ Multi-tenant (varios clientes en mismo hardware)\n2️⃣ Superficie de ataque amplia (muchos servicios expuestos)\n3️⃣ APIs expuestas a internet\n4️⃣ Dependencia de servicios cloud\n5️⃣ Configuraciones incorrectas en balanceadores\n6️⃣ Riesgo de ataques entre tenants' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 2000\n📌 Complejidad: 55%\n📌 Seguridad: 80%\n📌 Criticidad: 85%\n📌 Umbral de colapso: 85%\n\n📌 Factores de simulación:\n• β base: 1.5 × 1.2 (complejidad) = 1.8\n• γ base: 0.25 × 1.2 (seguridad) = 0.3\n• R₀ efectivo: 6.0' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 1.2 (complejidad media)\n🔄 Factor de recuperación: 1.2 (seguridad alta)\n📊 Modificadores:\n• Botnet: β×1.2, γ×1.2\n• Worm: β×1.2, γ×1.1\n• Ransomware: β×1.0, γ×1.2' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Segmentación estricta entre tenants\n2️⃣ Firewalls internos entre capas (web → app → db)\n3️⃣ Monitoreo continuo de APIs y balanceadores\n4️⃣ Parcheo automático de servidores\n5️⃣ Backup redundante en múltiples ubicaciones' 
      },
    ],
  },
  {
    id: 'doc_enterprise',
    title: 'Empresa',
    category: 'infrastructure',
    summary: 'Red corporativa con RRHH, finanzas y estaciones de trabajo. ~500 nodos.',
    tags: ['#Corporate', '#Phishing', '#Office'],
    sections: [
      { 
        title: '🏢 Descripción general', 
        content: 'Oficinas corporativas con departamentos de RRHH, finanzas, email y estaciones de trabajo para empleados.\n\n📌 Características:\n• Entorno corporativo típico\n• Usuarios con acceso a internet y email\n• Datos financieros y de recursos humanos\n• Estaciones de trabajo con software de oficina\n• Sistema de correo electrónico y colaboración' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Firewall → Core\n  ├─ RRHH\n  ├─ Finanzas (BD Financiera)\n  ├─ Servicios (Email, Intranet)\n  └─ Estaciones de Trabajo\n\n📌 Seguridad: Media-Alta (70%)\n📌 Complejidad: Media (50%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ Phishing (principal vector de ataque)\n2️⃣ Shadow IT (dispositivos no autorizados)\n3️⃣ Usuarios no entrenados en seguridad\n4️⃣ Políticas de seguridad laxas\n5️⃣ Acceso a datos financieros sensibles\n6️⃣ Correos corporativos sin cifrado' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 500\n📌 Complejidad: 50%\n📌 Seguridad: 70%\n📌 Criticidad: 60%\n📌 Umbral de colapso: 75%\n\n📌 Factores de simulación:\n• β base: 0.9 × 1.0 (complejidad) = 0.9\n• γ base: 0.4 × 1.0 (seguridad) = 0.4\n• R₀ efectivo: 2.25' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 1.0 (complejidad base)\n🔄 Factor de recuperación: 1.0 (seguridad base)\n📊 Modificadores:\n• Troyano: β×1.0, γ×1.0\n• Ransomware: β×1.0, γ×1.0\n• Spyware: β×1.0, γ×1.0' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Capacitar empleados contra phishing\n2️⃣ Implementar autenticación de dos factores\n3️⃣ Segmentar redes de RRHH y Finanzas\n4️⃣ Políticas estrictas de BYOD\n5️⃣ Backup automático de datos críticos' 
      },
    ],
  },
  {
    id: 'doc_industrial',
    title: 'Industria',
    category: 'infrastructure',
    summary: 'Planta OT/IT con SCADA, PLCs y sensores industriales. ~300 nodos.',
    tags: ['#OT', '#SCADA', '#Industrial'],
    sections: [
      { 
        title: '🏭 Descripción general', 
        content: 'Planta industrial con sistemas OT (Operational Technology) e IT. Incluye SCADA, PLCs, HMI y sensores industriales.\n\n📌 Características:\n• Sistemas de control industrial (SCADA)\n• Controladores lógicos programables (PLCs)\n• Interfaz humano-máquina (HMI)\n• Sensores IoT en la línea de producción\n• Historian DB para datos históricos' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Firewall OT\n  ├─ SCADA (Supervisión)\n  ├─ PLCs (Control de líneas)\n  ├─ HMI (Interfaz Humano-Máquina)\n  └─ Sensores IoT + Historian DB\n\n📌 Seguridad: Baja (40%)\n📌 Complejidad: Alta (70%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ Brecha OT/IT (falta de segmentación)\n2️⃣ PLCs sin parches de seguridad\n3️⃣ SCADA expuesto a internet\n4️⃣ Sistemas legacy sin actualizar\n5️⃣ Protocolos industriales inseguros (Modbus, PROFINET)\n6️⃣ Dispositivos sin autenticación' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 300\n📌 Complejidad: 70%\n📌 Seguridad: 40%\n📌 Criticidad: 90%\n📌 Umbral de colapso: 50%\n\n📌 Factores de simulación:\n• β base: 0.7 × 0.8 (complejidad) = 0.56\n• γ base: 0.2 × 0.7 (seguridad) = 0.14\n• R₀ efectivo: 4.0' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 0.8 (complejidad alta)\n🔄 Factor de recuperación: 0.7 (seguridad baja)\n📊 Modificadores:\n• Rootkit: β×0.8, γ×0.7\n• Worm: β×0.8, γ×0.7\n• Ransomware: β×0.8, γ×0.7' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Segmentación OT/IT (air-gap)\n2️⃣ Parcheo manual de PLCs y sistemas SCADA\n3️⃣ Monitoreo de tráfico industrial\n4️⃣ Aislar sistemas legacy\n5️⃣ Implementar autenticación en dispositivos industriales' 
      },
    ],
  },
  {
    id: 'doc_smartfactory',
    title: 'Smart Factory',
    category: 'infrastructure',
    summary: 'Fábrica inteligente con IoT, robots y gemelo digital. ~450 nodos.',
    tags: ['#Industry4', '#IoT', '#Robots'],
    sections: [
      { 
        title: '🤖 Descripción general', 
        content: 'Fábrica inteligente de Industria 4.0 con robots, AGVs, línea IoT, gemelo digital y sistema MES.\n\n📌 Características:\n• Sistema MES (Manufacturing Execution System)\n• Robots y AGVs en línea de producción\n• IoT y sensores en toda la planta\n• Gemelo digital para simulación\n• Control de calidad automatizado' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Firewall\n  ├─ MES (Sistema de Ejecución)\n  ├─ Robots/AGVs\n  ├─ Línea IoT\n  └─ Gemelo Digital + Control QC\n\n📌 Seguridad: Media (50%)\n📌 Complejidad: Alta (75%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ IoT expuesto a internet\n2️⃣ OTA (Over-The-Air) sin validación\n3️⃣ Robots sin segmentación\n4️⃣ Dependencia de conectividad\n5️⃣ Sistema MES sin autenticación fuerte\n6️⃣ Actualizaciones sin verificación' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 450\n📌 Complejidad: 75%\n📌 Seguridad: 50%\n📌 Criticidad: 88%\n📌 Umbral de colapso: 55%\n\n📌 Factores de simulación:\n• β base: 0.6 × 1.0 (complejidad) = 0.6\n• γ base: 0.5 × 0.75 (seguridad) = 0.375\n• R₀ efectivo: 1.6' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 1.0 (complejidad alta)\n🔄 Factor de recuperación: 0.75 (seguridad media-baja)\n📊 Modificadores:\n• Spyware: β×1.0, γ×0.75\n• Worm: β×1.0, γ×0.75\n• Troyano: β×0.9, γ×0.75' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Segmentar robots y sistemas MES\n2️⃣ Implementar autenticación en actualizaciones OTA\n3️⃣ Monitorear IoT y sensores\n4️⃣ Backup frecuente del gemelo digital\n5️⃣ Control de acceso a sistemas de producción' 
      },
    ],
  },
  {
    id: 'doc_critical',
    title: 'Infra. Crítica',
    category: 'infrastructure',
    summary: 'Infraestructura nacional: energía, agua, transporte y telecomunicaciones. ~1500 nodos.',
    tags: ['#National', '#Critical', '#Essential'],
    sections: [
      { 
        title: '⚡ Descripción general', 
        content: 'Infraestructura nacional crítica que incluye servicios esenciales: energía eléctrica, agua potable, transporte y telecomunicaciones.\n\n📌 Características:\n• Servicios esenciales para la población\n• Sistemas de misión crítica\n• SCADA nacional para supervisión\n• Redes de distribución de energía y agua\n• Sistemas de transporte y comunicaciones' 
      },
      { 
        title: '🔧 Topología de red', 
        content: 'Internet → Firewall → SCADA Nacional\n  ├─ Red Eléctrica (Subestaciones)\n  ├─ Red Hídrica (Bombeo)\n  ├─ Transporte (Señalización)\n  └─ Telecomunicaciones + Centro OPS\n\n📌 Seguridad: Media-Alta (75%)\n📌 Complejidad: Crítica (85%)' 
      },
      { 
        title: '⚠️ Vulnerabilidades principales', 
        content: '1️⃣ SCADA nacional sin parches\n2️⃣ Redes eléctricas expuestas\n3️⃣ Sistemas legacy de misión crítica\n4️⃣ Consecuencias civiles severas\n5️⃣ Dependencia de sistemas obsoletos\n6️⃣ Falta de segmentación en sistemas críticos' 
      },
      { 
        title: '📊 Datos técnicos', 
        content: '📌 Nodos totales: 1500\n📌 Complejidad: 85%\n📌 Seguridad: 75%\n📌 Criticidad: 100%\n📌 Umbral de colapso: 45%\n\n📌 Factores de simulación:\n• β base: 0.4 × 0.9 (complejidad) = 0.36\n• γ base: 0.8 × 0.85 (seguridad) = 0.68\n• R₀ efectivo: 0.53' 
      },
      { 
        title: '🧮 Parámetros de simulación', 
        content: '📈 Factor de propagación: 0.9 (complejidad crítica)\n🔄 Factor de recuperación: 0.85 (seguridad media-alta)\n📊 Modificadores:\n• Adware: β×0.9, γ×0.85\n• Worm: β×0.9, γ×0.8\n• Ransomware: β×0.9, γ×0.85' 
      },
      { 
        title: '💡 Estrategias recomendadas', 
        content: '1️⃣ Aislamiento total de sistemas SCADA\n2️⃣ Actualización de sistemas legacy\n3️⃣ Monitoreo 24/7 de infraestructura crítica\n4️⃣ Planes de contingencia y recuperación\n5️⃣ Segmentación estricta entre sistemas críticos' 
      },
    ],
  },

  // ─── MITIGACIONES ────────────────────────────────────────────────────────────

  {
    id: 'doc_firewall',
    title: 'Firewall',
    category: 'mitigation',
    summary: 'Filtrado perimetral de conexiones. Reduce la tasa de infección.',
    tags: ['#Prevention', '#Network'],
    sections: [
      { 
        title: '🛡️ Función y propósito', 
        content: 'El Firewall es la primera línea de defensa. Filtra el tráfico entrante y saliente según reglas de seguridad, bloqueando conexiones sospechosas y maliciosas.\n\n📌 Propósito:\n• Bloquear tráfico malicioso entrante\n• Controlar conexiones salientes\n• Prevenir exfiltración de datos\n• Detectar patrones de ataque conocidos' 
      },
      { 
        title: '📊 Efecto en el modelo SIR', 
        content: '📈 Multiplicador β: 0.70\n🔄 Multiplicador γ: 1.00\n📊 Efecto: reduce la tasa de infección un 30%\n\n📌 Efectivo contra:\n• Worm: β×0.70\n• Botnet: β×0.70\n• Spyware: β×0.70\n• Adware: β×0.70' 
      },
      { 
        title: '💡 Cuándo y cómo usarlo', 
        content: '✅ USAR:\n• Siempre recomendado en cualquier infraestructura\n• Especialmente efectivo contra Worm y Botnet\n• Bloquea tráfico malicioso y exfiltración\n• Primera línea de defensa\n\n⏱️ Activación: inmediata (primeros 5 segundos de detección)' 
      },
      { 
        title: '⚠️ Limitaciones y contraindicaciones', 
        content: '❌ LIMITACIONES:\n• No detiene Ransomware (ya cifró los datos)\n• No afecta a malwares internos\n• Puede retrasar detección de Troyanos\n\n⚠️ CONTRAINDICACIONES:\n• Contra Ransomware: NO ES EFECTIVO\n• Contra Troyano: puede retrasar la detección' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📐 Fórmula de efectividad:\nβ_eff = β × (0.70) = 30% de reducción\n\n📌 Efectividad por malware:\n• Worm: ⭐⭐⭐⭐⭐ (5/5)\n• Botnet: ⭐⭐⭐⭐⭐ (5/5)\n• Spyware: ⭐⭐⭐⭐☆ (4/5)\n• Ransomware: ⭐☆☆☆☆ (1/5)\n• Troyano: ⭐⭐☆☆☆ (2/5)' 
      },
    ],
  },
  {
    id: 'doc_isolation',
    title: 'Aislamiento',
    category: 'mitigation',
    summary: 'Segmentación de red y corte de internet. Detiene movimiento lateral.',
    tags: ['#Containment', '#Network'],
    sections: [
      { 
        title: '🔒 Función y propósito', 
        content: 'El Aislamiento segmenta la red y corta el acceso a internet, deteniendo el movimiento lateral del malware y aislando nodos infectados.\n\n📌 Propósito:\n• Cortar propagación horizontal\n• Aislar nodos infectados\n• Prevenir exfiltración de datos\n• Contener brotes de malware' 
      },
      { 
        title: '📊 Efecto en el modelo SIR', 
        content: '📈 Multiplicador β: 0.60\n🔄 Multiplicador γ: 1.00\n📊 Efecto: reduce la propagación un 40%\n\n📌 Efectivo contra:\n• Worm: β×0.60\n• Botnet: β×0.60\n• Spyware: β×0.60\n• Ransomware: β×0.60' 
      },
      { 
        title: '💡 Cuándo y cómo usarlo', 
        content: '✅ USAR:\n• CRÍTICO contra Worm (corta multiplicación)\n• Efectivo contra Botnet (detiene expansión)\n• Protege contra Spyware (corta exfiltración)\n• Corta propagación horizontal\n\n⏱️ Activación: inmediata (al detectar primer nodo infectado)' 
      },
      { 
        title: '⚠️ Limitaciones y contraindicaciones', 
        content: '❌ LIMITACIONES:\n• Puede mover Troyano a otro nodo\n• No detiene Ransomware activo\n• No afecta a malwares que ya están dentro\n\n⚠️ CONTRAINDICACIONES:\n• Contra Troyano: puede empeorar la situación\n• Contra Ransomware: ya cifró los datos' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📐 Fórmula de efectividad:\nβ_eff = β × (0.60) = 40% de reducción\n\n📌 Efectividad por malware:\n• Worm: ⭐⭐⭐⭐⭐ (5/5)\n• Botnet: ⭐⭐⭐⭐⭐ (5/5)\n• Spyware: ⭐⭐⭐⭐☆ (4/5)\n• Ransomware: ⭐⭐☆☆☆ (2/5)\n• Troyano: ⭐☆☆☆☆ (1/5)' 
      },
    ],
  },
  {
    id: 'doc_patch',
    title: 'Patch (Parcheo)',
    category: 'mitigation',
    summary: 'Gestión de parches y actualizaciones. Corrige vulnerabilidades.',
    tags: ['#Prevention', '#Update'],
    sections: [
      { 
        title: '🔧 Función y propósito', 
        content: 'El Parcheo aplica actualizaciones de seguridad para eliminar vulnerabilidades conocidas, corrigiendo fallos de seguridad en el software y sistemas.\n\n📌 Propósito:\n• Eliminar vulnerabilidades\n• Prevenir futuras infecciones\n• Cerrar puertas traseras\n• Actualizar sistemas obsoletos' 
      },
      { 
        title: '📊 Efecto en el modelo SIR', 
        content: '📈 Multiplicador β: 1.00\n🔄 Multiplicador γ: 1.30\n📊 Efecto: acelera la recuperación un 30%\n\n📌 Efectivo contra:\n• Rootkit: γ×1.30\n• Spyware: γ×1.30\n• Adware: γ×1.30\n• Worm: γ×1.30 (después de controlar)' 
      },
      { 
        title: '💡 Cuándo y cómo usarlo', 
        content: '✅ USAR:\n• Efectivo contra Rootkit (cierra puertas traseras)\n• Útil para Spyware y Adware\n• Previene futuras infecciones\n• Después de controlar brote\n\n⏱️ Activación: después de aislar el brote' 
      },
      { 
        title: '⚠️ Limitaciones y contraindicaciones', 
        content: '❌ LIMITACIONES:\n• No detiene Ransomware durante el ataque\n• Puede retrasar contención de Worm\n• No afecta a malwares activos en ejecución\n\n⚠️ CONTRAINDICACIONES:\n• Contra Worm ACTIVO: retrasa contención\n• Contra Ransomware: no detiene cifrado' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📐 Fórmula de efectividad:\nγ_eff = γ × (1.30) = 30% más rápido\n\n📌 Efectividad por malware:\n• Rootkit: ⭐⭐⭐⭐⭐ (5/5)\n• Spyware: ⭐⭐⭐⭐☆ (4/5)\n• Adware: ⭐⭐⭐⭐☆ (4/5)\n• Worm: ⭐⭐⭐☆☆ (3/5) (después de controlar)\n• Ransomware: ⭐⭐☆☆☆ (2/5)' 
      },
    ],
  },
  {
    id: 'doc_ids',
    title: 'IDS/IPS',
    category: 'mitigation',
    summary: 'Detección y prevención de intrusos en tiempo real.',
    tags: ['#Detection', '#Monitoring'],
    sections: [
      { 
        title: '👁️ Función y propósito', 
        content: 'El IDS/IPS detecta y bloquea tráfico malicioso en tiempo real mediante análisis de comportamiento y firmas de ataques conocidas.\n\n📌 Propósito:\n• Detectar intrusos en tiempo real\n• Bloquear tráfico malicioso\n• Identificar patrones de ataque\n• Alertar sobre actividad sospechosa' 
      },
      { 
        title: '📊 Efecto en el modelo SIR', 
        content: '📈 Multiplicador β: 0.85\n🔄 Multiplicador γ: 1.15\n📊 Efecto: reduce infección 15% y acelera recuperación 15%\n\n📌 Probabilidad de detección de Troyano: 8% por segundo real' 
      },
      { 
        title: '💡 Cuándo y cómo usarlo', 
        content: '✅ USAR:\n• CRÍTICO contra Troyano (8% de detección por segundo)\n• Efectivo contra Botnet y Rootkit\n• Detecta intrusos ocultos\n• Monitoreo continuo de red\n\n⏱️ Activación: inmediata (constante)' 
      },
      { 
        title: '⚠️ Limitaciones y contraindicaciones', 
        content: '❌ LIMITACIONES:\n• No detiene Ransomware\n• Puede generar falsos positivos\n• No bloquea todos los ataques\n\n⚠️ CONTRAINDICACIONES:\n• Contra Ransomware: NO ES EFECTIVO\n• Puede saturar con alertas si está mal configurado' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📐 Fórmula de efectividad:\nβ_eff = β × 0.85 = 15% menos infección\nγ_eff = γ × 1.15 = 15% más recuperación\n\n📌 Efectividad por malware:\n• Troyano: ⭐⭐⭐⭐⭐ (5/5)\n• Botnet: ⭐⭐⭐⭐☆ (4/5)\n• Rootkit: ⭐⭐⭐⭐☆ (4/5)\n• Worm: ⭐⭐⭐☆☆ (3/5)\n• Ransomware: ⭐☆☆☆☆ (1/5)' 
      },
    ],
  },
  {
    id: 'doc_backup',
    title: 'Backup',
    category: 'mitigation',
    summary: 'Recuperación de datos. Vuelve los nodos azules (recuperados).',
    tags: ['#Recovery', '#Data'],
    sections: [
      { 
        title: '💾 Función y propósito', 
        content: 'El Backup restaura sistemas desde copias de seguridad verificadas. Convierte nodos infectados (rojo) y aislados (amarillo) a recuperados (azul).\n\n📌 Propósito:\n• Recuperar datos perdidos\n• Restaurar sistemas infectados\n• Volver nodos a estado saludable\n• Recuperar nodos aislados\n\n⏱️ Duración: 3-10 segundos reales según el malware' 
      },
      { 
        title: '📊 Efecto en el modelo SIR', 
        content: '📈 Multiplicador β: 1.00\n🔄 Multiplicador γ: 1.40\n📊 Efecto: acelera la recuperación un 40%\n\n📌 Duración por malware:\n• Adware: 3-4 segundos\n• Spyware: 4-5 segundos\n• Troyano: 5-6 segundos\n• Worm: 6-7 segundos\n• Botnet: 6-7 segundos\n• Rootkit: 7-8 segundos\n• Ransomware: 8-10 segundos (requiere 2-4 backups)' 
      },
      { 
        title: '💡 Cuándo y cómo usarlo', 
        content: '✅ USAR:\n• DESPUÉS de controlar la infección (todos los nodos VERDES)\n• CRÍTICO contra Ransomware (requiere 2-4 backups)\n• Contra Troyano: backup a todos los nodos menos el aislado\n• Recupera nodos aislados (amarillo → azul)\n\n⏱️ Activación: cuando todos los nodos estén VERDES' 
      },
      { 
        title: '⚠️ Limitaciones y contraindicaciones', 
        content: '❌ LIMITACIONES:\n• Backup ANTES de tiempo AUMENTA la infección\n• No funciona en nodos muertos (💀)\n• Ineficaz contra Worm si está activo\n\n⚠️ CONTRAINDICACIONES:\n• Backup con >30% de infección: AUMENTA la propagación\n• Contra Worm activo: puede propagar el gusano' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📐 Fórmula de efectividad:\nγ_eff = γ × 1.40 = 40% más recuperación\n\n📌 Efectividad por malware:\n• Ransomware: ⭐⭐⭐⭐⭐ (5/5 - CRÍTICO)\n• Troyano: ⭐⭐⭐⭐☆ (4/5)\n• Worm: ⭐⭐⭐⭐☆ (4/5) (después de controlar)\n• Botnet: ⭐⭐⭐⭐☆ (4/5)\n• Spyware: ⭐⭐⭐⭐☆ (4/5)' 
      },
    ],
  },
  {
    id: 'doc_scan',
    title: 'Escaneo',
    category: 'mitigation',
    summary: 'Análisis de malware y detección de amenazas ocultas.',
    tags: ['#Detection', '#Analysis'],
    sections: [
      { 
        title: '🔍 Función y propósito', 
        content: 'El Escaneo analiza nodos para detectar malware oculto, especialmente Troyanos y Rootkits que no se ven con detección de intrusos.\n\n📌 Propósito:\n• Detectar malware oculto\n• Revelar Troyanos y Rootkits\n• Analizar nodos sospechosos\n• Encontrar amenazas invisibles' 
      },
      { 
        title: '📊 Efecto en el modelo SIR', 
        content: '📈 Multiplicador β: 0.90\n🔄 Multiplicador γ: 1.10\n📊 Efecto: reduce infección 10% y acelera recuperación 10%\n\n⏱️ Duración:\n• Escaneo global: 3 segundos reales\n• Escaneo manual: 5 segundos reales por nodo' 
      },
      { 
        title: '💡 Cuándo y cómo usarlo', 
        content: '✅ USAR:\n• CRÍTICO contra Troyano (lo revela)\n• CRÍTICO contra Rootkit (lo encuentra)\n• Detecta amenazas ocultas en la red\n• Revela nodos infectados ocultos\n\n⏱️ Activación: al sospechar de malware oculto' 
      },
      { 
        title: '⚠️ Limitaciones y contraindicaciones', 
        content: '❌ LIMITACIONES:\n• No es efectivo contra Worm o Botnet (son visibles)\n• Puede consumir recursos si se usa en exceso\n• No detecta todo tipo de malware\n\n⚠️ CONTRAINDICACIONES:\n• Contra Worm o Botnet: no es necesario (ya son visibles)' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📐 Fórmula de efectividad:\nβ_eff = β × 0.90 = 10% menos infección\nγ_eff = γ × 1.10 = 10% más recuperación\n\n📌 Efectividad por malware:\n• Troyano: ⭐⭐⭐⭐⭐ (5/5 - CRÍTICO)\n• Rootkit: ⭐⭐⭐⭐⭐ (5/5 - CRÍTICO)\n• Spyware: ⭐⭐⭐⭐☆ (4/5)\n• Worm: ⭐⭐☆☆☆ (2/5)\n• Botnet: ⭐⭐☆☆☆ (2/5)' 
      },
    ],
  },

  // ─── MATEMÁTICAS ────────────────────────────────────────────────────────────

  {
    id: 'doc_sir',
    title: 'Modelo SIR',
    category: 'math',
    summary: 'Susceptible-Infectado-Recuperado. Modelo epidemiológico básico.',
    tags: ['#SIR', '#Epidemiology'],
    sections: [
      { 
        title: '📐 Ecuaciones diferenciales', 
        content: '📊 MODELO SIR (Susceptible-Infectado-Recuperado):\n\ndS/dt = -β·S·I/N\ndI/dt = β·S·I/N - γ·I\ndR/dt = γ·I\n\n📌 Variables:\n• S = Susceptibles (nodos sanos)\n• I = Infectados (nodos comprometidos)\n• R = Recuperados (nodos limpios e inmunes)\n• N = Población total (S + I + R)\n• β = Tasa de infección\n• γ = Tasa de recuperación\n\n📌 Conservación de masa:\nS(t) + I(t) + R(t) = N (constante)' 
      },
      { 
        title: '📖 Interpretación biológica', 
        content: '📌 SIGNIFICADO DE CADA TÉRMINO:\n\n• -β·S·I/N: Tasa de nuevos infectados\n  (susceptibles que se convierten en infectados)\n\n• +β·S·I/N: Tasa de infección\n  (nuevos infectados que provienen de susceptibles)\n\n• -γ·I: Tasa de recuperación\n  (infectados que se recuperan)\n\n• +γ·I: Tasa de recuperados\n  (infectados que pasan a recuperados)\n\n📌 Interpretación en ciberseguridad:\n• S = nodos SANOS (verdes)\n• I = nodos COMPROMETIDOS (rojos)\n• R = nodos LIMPIOS E INMUNES (azules)' 
      },
      { 
        title: '📊 Significado de R₀', 
        content: '📊 R₀ = β/γ (número básico de reproducción)\n\n📌 Interpretación:\n• R₀ > 1: BROTE EPIDÉMICO (el malware se propaga)\n• R₀ = 1: ESTABLE (la infección se mantiene constante)\n• R₀ < 1: CONTROLADO (la infección desaparece)\n\n📌 Ejemplos en LAB-EDO:\n• Worm: R₀ = 6.0 → BROTE SEVERO\n• Ransomware: R₀ = 8.0 → BROTE CRÍTICO\n• Troyano: R₀ = 2.25 → BROTE MODERADO\n• Adware: R₀ = 0.5 → CONTROLADO (no se propaga)' 
      },
      { 
        title: '🧮 Implementación numérica', 
        content: '📌 MÉTODOS DE INTEGRACIÓN:\n\n1️⃣ MÉTODO DE EULER (O(h)):\nS_{n+1} = S_n + (-β·S·I/N)·h\nI_{n+1} = I_n + (β·S·I/N - γ·I)·h\nR_{n+1} = R_n + (γ·I)·h\n\n2️⃣ MÉTODO RUNGE-KUTTA 4 (O(h⁴)):\n(Ver sección RK4)\n\n📌 PARÁMETROS:\n• dt (paso de tiempo): 0.1 (configurable)\n• N: número total de nodos\n• β: depende del malware e infraestructura\n• γ: depende del malware e infraestructura\n\n📌 SOLVER RECOMENDADO: RK4 con dt=0.1' 
      },
      { 
        title: '💻 Código de integración RK4', 
        content: 'function rk4(S, I, R, b, g, N, dt) {\n  const f = (s, i) => ({\n    dS: (-b*s*i)/N,\n    dI: (b*s*i)/N - g*i,\n    dR: g*i\n  });\n  \n  const k1 = f(S, I);\n  const k2 = f(S + k1.dS*dt/2, I + k1.dI*dt/2);\n  const k3 = f(S + k2.dS*dt/2, I + k2.dI*dt/2);\n  const k4 = f(S + k3.dS*dt, I + k3.dI*dt);\n  \n  return {\n    S: S + (k1.dS + 2*k2.dS + 2*k3.dS + k4.dS)*dt/6,\n    I: I + (k1.dI + 2*k2.dI + 2*k3.dI + k4.dI)*dt/6,\n    R: R + (k1.dR + 2*k2.dR + 2*k3.dR + k4.dR)*dt/6,\n  };\n}' 
      },
    ],
  },
  {
    id: 'doc_euler',
    title: 'Método de Euler',
    category: 'math',
    summary: 'Integración numérica de primer orden. Simple y rápido.',
    tags: ['#Euler', '#Numerical'],
    sections: [
      { 
        title: '📐 Fórmula', 
        content: '📌 MÉTODO DE EULER:\ny_{n+1} = y_n + h·f(t_n, y_n)\n\n📌 Aplicación al modelo SIR:\nS_{n+1} = S_n + (-β·S·I/N)·h\nI_{n+1} = I_n + (β·S·I/N - γ·I)·h\nR_{n+1} = R_n + (γ·I)·h' 
      },
      { 
        title: '📖 Características', 
        content: '📌 VENTAJAS:\n• Simple y rápido de calcular\n• Fácil de implementar\n• Bajo costo computacional\n\n📌 DESVENTAJAS:\n• Error: O(h) (error proporcional al paso)\n• Puede ser inestable con dt grande\n• Menos preciso que RK4\n\n📌 RECOMENDACIÓN:\n• Usar para simulaciones rápidas\n• Usar dt ≤ 0.05 para precisión aceptable\n• No usar para simulaciones largas (> 1000 pasos)' 
      },
      { 
        title: '🧮 Implementación', 
        content: 'function euler(S, I, R, b, g, N, dt) {\n  const dS = (-b*S*I)/N;\n  const dI = (b*S*I)/N - g*I;\n  const dR = g*I;\n  \n  return {\n    S: S + dS*dt,\n    I: I + dI*dt,\n    R: R + dR*dt\n  };\n}' 
      },
    ],
  },
  {
    id: 'doc_rk4',
    title: 'Runge-Kutta 4',
    category: 'math',
    summary: 'Integración de cuarto orden. Más precisa que Euler.',
    tags: ['#RK4', '#Numerical'],
    sections: [
      { 
        title: '📐 Fórmula', 
        content: '📌 MÉTODO RUNGE-KUTTA 4:\n\nk₁ = f(t_n, y_n)\nk₂ = f(t_n + h/2, y_n + h/2·k₁)\nk₃ = f(t_n + h/2, y_n + h/2·k₂)\nk₄ = f(t_n + h, y_n + h·k₃)\n\ny_{n+1} = y_n + h/6·(k₁ + 2k₂ + 2k₃ + k₄)' 
      },
      { 
        title: '📖 Características', 
        content: '📌 VENTAJAS:\n• Mucho más preciso que Euler\n• Error: O(h⁴) (muy preciso)\n• Estable incluso con dt moderado\n• Recomendado para simulaciones precisas\n\n📌 DESVENTAJAS:\n• Más lento que Euler (4 evaluaciones por paso)\n• Más complejo de implementar\n• Mayor costo computacional\n\n📌 RECOMENDACIÓN:\n• Usar para simulaciones precisas\n• Usar dt=0.1 para mejores resultados\n• Solver por defecto en LAB-EDO' 
      },
      { 
        title: '🧮 Implementación', 
        content: 'function rk4(S, I, R, b, g, N, dt) {\n  const f = (s, i) => ({\n    dS: (-b*s*i)/N,\n    dI: (b*s*i)/N - g*i,\n    dR: g*i\n  });\n  \n  const k1 = f(S, I);\n  const k2 = f(S + k1.dS*dt/2, I + k1.dI*dt/2);\n  const k3 = f(S + k2.dS*dt/2, I + k2.dI*dt/2);\n  const k4 = f(S + k3.dS*dt, I + k3.dI*dt);\n  \n  return {\n    S: S + (k1.dS + 2*k2.dS + 2*k3.dS + k4.dS)*dt/6,\n    I: I + (k1.dI + 2*k2.dI + 2*k3.dI + k4.dI)*dt/6,\n    R: R + (k1.dR + 2*k2.dR + 2*k3.dR + k4.dR)*dt/6,\n  };\n}' 
      },
    ],
  },
  {
    id: 'doc_numerical',
    title: 'Comparación Euler vs RK4',
    category: 'math',
    summary: 'Comparación de métodos numéricos y su precisión.',
    tags: ['#Euler', '#RK4', '#Comparison'],
    sections: [
      { 
        title: '📊 Precisión', 
        content: '📌 COMPARACIÓN DE ERRORES:\n\n• Euler: Error O(h)\n  → con dt=0.1, error ~0.1\n  → con dt=0.01, error ~0.01\n\n• RK4: Error O(h⁴)\n  → con dt=0.1, error ~0.0001\n  → con dt=0.01, error ~0.00000001\n\n📌 CONCLUSIÓN:\nRK4 es ~1000 veces más preciso que Euler con el mismo dt.' 
      },
      { 
        title: '⚡ Rendimiento', 
        content: '📌 COSTO COMPUTACIONAL:\n\n• Euler: 4 operaciones por paso\n  → Muy rápido (ideal para simulaciones en tiempo real)\n  → 1 evaluación de función por paso\n\n• RK4: 16 operaciones por paso\n  → 4 veces más lento que Euler\n  → 4 evaluaciones de función por paso\n\n📌 CONCLUSIÓN:\nEn la práctica, la diferencia es imperceptible para N < 10000 nodos.' 
      },
      { 
        title: '🎯 Recomendación', 
        content: '📌 CUÁNDO USAR CADA MÉTODO:\n\n✅ USAR RK4 (recomendado):\n• Simulaciones precisas\n• Análisis detallado de propagación\n• Simulaciones largas (> 1000 pasos)\n• LAB-EDO usa RK4 por defecto\n\n✅ USAR EULER:\n• Simulaciones rápidas\n• Pruebas preliminares\n• Simulaciones cortas (< 100 pasos)\n• Cuando la precisión no es crítica' 
      },
    ],
  },

  // ─── GUÍA ────────────────────────────────────────────────────────────────────

  {
    id: 'guide_usage',
    title: 'Guía de Uso',
    category: 'guide',
    summary: 'Cómo usar LAB-EDO paso a paso',
    tags: ['#Help', '#Tutorial'],
    sections: [
      { 
        title: '1️⃣ Seleccionar escenario', 
        content: 'Elige un malware y una infraestructura en el panel izquierdo. Los parámetros β, γ y N se actualizan automáticamente.\n\n📌 Pasos:\n1. Haz click en un malware (Worm, Ransomware, etc.)\n2. Haz click en una infraestructura (Universidad, Hospital, etc.)\n3. Los parámetros se actualizan automáticamente\n4. Revisa el resumen de contexto para ver la configuración' 
      },
      { 
        title: '2️⃣ Modos de simulación', 
        content: '🔬 SIMULACIÓN: Mitigaciones automáticas según umbrales de infección.\n🎮 INTERACTIVO: TÚ activas las mitigaciones manualmente.\n\n📌 UMbrales de mitigación automática (simulación):\n• >8% infección: Firewall\n• >15% infección: IDS/IPS\n• >20% infección: Patch\n• >40% infección: Aislamiento\n• >65% infección: Backup' 
      },
      { 
        title: '3️⃣ Controles en la topología', 
        content: '🖱 CLICK → Backup en el nodo\n🖱 DOBLE CLICK → Parchear nodo\n🖱 CLICK DERECHO → Escanear nodo\n🖱 DOBLE CLICK DERECHO → Aislar nodo\n\n📌 SOLO en modo INTERACTIVO.' 
      },
      { 
        title: '4️⃣ Controles globales', 
        content: '▶ Iniciar · ⏸ Pausar · ⏹ Detener · ↺ Reiniciar\n📊 Cambia solver (Euler/RK4) en parámetros del header.\n\n📌 Botones de mitigación global:\n• FIREWALL: filtrado de conexiones\n• ISOLATION: corte de internet\n• PATCH: gestión de parches\n• IDS/IPS: detección de intrusos\n• BACKUP: recuperación de datos\n• ESCANEO: análisis de malware' 
      },
      { 
        title: '5️⃣ Interpretar resultados', 
        content: '📈 Gráfica SIR: curvas de propagación (S: azul, I: rojo, R: verde)\n📊 Analytics: R₀, pico de infección, tráfico\n💚 Salud de infraestructura: porcentaje operativo\n📋 Eventos: registro de todas las acciones y detecciones' 
      },
      { 
        title: '6️⃣ Modo interactivo — consejos', 
        content: '⚠️ IMPORTANTE:\n• NO uses backup antes de tener nodos verdes (AUMENTA INFECCIÓN)\n• Ransomware requiere MÚLTIPLES backups (2-4)\n• Troyano necesita ESCANEO para ser detectado\n• Rootkit requiere escanear nodo por nodo\n• Worm necesita AISLAMIENTO y CORTE DE INTERNET\n• Botnet necesita AISLAR NODO MADRE\n• Spyware necesita AISLAR INTERNET y FIREWALL\n\n📌 Consulta la enciclopedia para más detalles de cada malware.' 
      },
      { 
        title: '7️⃣ Estados de los nodos', 
        content: '🟢 VERDE = Susceptible (sano, puede ser infectado)\n🔴 ROJO = Infectado (comprometido, propaga)\n🔵 AZUL = Recuperado (limpio, inmune)\n🟡 AMARILLO = Aislado (desconectado, no propaga)\n💀 GRIS/NEGRO = Muerto (irrecuperable)' 
      },
      { 
        title: '8️⃣ 🧮 Solver y precisión', 
        content: '📌 EULER:\n• Rápido, menos preciso\n• Error O(h)\n• Usar para simulaciones rápidas\n\n📌 RK4 (RECOMENDADO):\n• Más lento, muy preciso\n• Error O(h⁴)\n• Usar dt=0.1 para mejores resultados\n• Solver por defecto en LAB-EDO' 
      },
    ],
  },

  // ─── UNIVERSIDAD ────────────────────────────────────────────────────────────

  {
    id: 'doc_labedo',
    title: '🏛️ Universidad Dr. José Gregorio Hernández',
    category: 'guide',
    summary: 'Cátedra: Ecuaciones Diferenciales · Profesor: Manuel Fereira',
    tags: ['#UJGH', '#EcuacionesDiferenciales', '#LAB-EDO'],
    sections: [
      { 
        title: '🏛️ Universidad Dr. José Gregorio Hernández',
        content: 'La Universidad de los Valores'
      },
      { 
        title: '📚 Cátedra',
        content: 'Ecuaciones Diferenciales'
      },
      { 
        title: '👨‍🏫 Profesor',
        content: 'Manuel Fereira'
      },
      { 
        title: '👨‍🎓 Autores', 
        content: 'Ramirez Emiliangely\nDiaz Maria\nSaras Alfonso\nAndrade Sebastian'
      },
      { 
        title: '📖 Sobre LAB-EDO', 
        content: 'LAB-EDO (Laboratorio de Ecuaciones Diferenciales) es un simulador de propagación de malware basado en el modelo epidemiológico SIR (Susceptible-Infectado-Recuperado).\n\nDesarrollado como proyecto de la Cátedra de Ecuaciones Diferenciales, este simulador permite visualizar y analizar cómo se propaga un malware en una infraestructura tecnológica, aplicando conceptos matemáticos de ecuaciones diferenciales para modelar la dinámica de infección.\n\nEl modelo SIR utiliza ecuaciones diferenciales para describir la evolución de tres poblaciones:\n• S(t) = Nodos susceptibles (sanos)\n• I(t) = Nodos infectados\n• R(t) = Nodos recuperados (inmunes)\n\nLas ecuaciones que rigen el sistema son:\ndS/dt = -β·S·I/N\ndI/dt = β·S·I/N - γ·I\ndR/dt = γ·I\n\nDonde β es la tasa de infección y γ la tasa de recuperación.'
      },
      { 
        title: '🎯 Objetivos del proyecto', 
        content: '1️⃣ Aplicar conceptos de ecuaciones diferenciales a un problema de ciberseguridad\n2️⃣ Visualizar la propagación de malware en tiempo real\n3️⃣ Entender cómo las mitigaciones afectan la dinámica de infección\n4️⃣ Comparar métodos numéricos: Euler vs Runge-Kutta 4\n5️⃣ Desarrollar habilidades de programación y simulación\n6️⃣ Aprender sobre modelos epidemiológicos SIR\n7️⃣ Aplicar métodos numéricos en un contexto práctico'
      },
      { 
        title: '🛠️ Tecnologías utilizadas', 
        content: '📌 FRONTEND:\n• React + TypeScript\n• Canvas para visualización de topología de red\n• CSS para diseño dark cyber-security\n\n📌 MODELADO:\n• Modelo SIR con integración numérica (Euler y RK4)\n• Sistema de mitigaciones interactivo\n• Simulación en tiempo real\n\n📌 INTERFAZ:\n• Diseño cyber-security oscuro\n• Sistema de enciclopedia integrado\n• Ayuda interactiva'
      },
      { 
        title: '📚 Agradecimientos', 
        content: '🙏 A la Universidad Dr. José Gregorio Hernández por el espacio académico.\n🙏 Al Profesor Manuel Fereira por su guía y enseñanzas.\n🙏 A todos los que han contribuido a este proyecto.\n\n👨‍🎓 Autores del proyecto:\n• Ramirez Emiliangely\n• Diaz Maria\n• Saras Alfonso\n• Andrade Sebastian'
      },
    ],
  },
];

export function getDocById(id: string): DocEntry | undefined {
  return documentationEntries.find((d) => d.id === id);
}

export function getDocsByCategory(category: DocEntry['category']): DocEntry[] {
  return documentationEntries.filter((d) => d.category === category);
}

export function searchDocs(query: string): DocEntry[] {
  const q = query.toLowerCase();
  return documentationEntries.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.sections.some((s) => s.content.toLowerCase().includes(q))
  );
}