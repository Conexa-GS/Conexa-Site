/* Reference-inspired vector puppets. Each placement and each animated joint
   have their own group: an animation never overwrites a limb's attachment. */
const palettes = {
  farmer: { shirt: '#fff5df', shade: '#eadbc2', cap: '#ffc448', hair: '#31314e' },
  buyer: { shirt: '#fff5df', shade: '#eadbc2', cap: '#2b8557', hair: '#31314e' },
  carrier: { shirt: '#f06b35', shade: '#d95729', cap: '#ffc448', hair: '#493b35' },
}

function produce(id) {
  return `<g class="char-harvest">
    <g class="char-leaves" fill="#6baf3b"><path d="M-29-16C-60-46-31-67-19-38C-35-82-3-88 2-42C5-83 35-70 21-34C48-58 60-31 31-11Z"/><path d="M-26-10Q-38-43-13-48Q8-50 12-17Z" fill="#90bc41"/><path d="M-8-19Q-6-50 14-51Q37-42 15-12Z" fill="#448e38"/></g>
    <g transform="translate(28 -23) rotate(12)"><path d="M-9 0Q0-17 10 0L2 34Q-2 38-5 31Z" fill="#f4a326"/><path d="M0-5Q-17-28-7-30Q4-29 2-9Q13-33 21-25Q27-18 7-3" fill="#39844a"/><path d="m-6 7 8 2M-3 17l6 1" stroke="#df811f" stroke-width="2"/></g>
    <g transform="translate(-31 -1)"><circle r="15" fill="#ec5633"/><path d="m-8-13 8 4 8-6-2 9-8-3-7 3Z" fill="#3f823b"/><path d="M-9-2q-4 7 2 11" stroke="#f68e56" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <path d="M-58 6Q-62 3-60-4L60-4Q66-3 63 6L57 51Q0 66-55 48Z" fill="url(#${id}-wood)"/>
    <path d="M-57 12Q0 25 61 12M-56 30Q0 43 59 30" fill="none" stroke="#b97932" stroke-width="5"/>
    <path d="m-46 3 4 45M47 3l-4 47" stroke="#ffd78c" stroke-width="8"/>
    <path d="M-11 9h24" stroke="#ab6c2e" stroke-width="5" stroke-linecap="round"/>
  </g>`
}

function head(role, p, id) {
  return `<g transform="translate(180 148)"><g class="char-head">
    ${role === 'farmer' ? '<g class="char-hair"><path d="M-32-54C-68-47-53-20-66-7C-91 17-61 40-41 26C-62 55-27 55-14 31L26 20L31-48Z" fill="#31314e"/><path d="M-55 10Q-72 30-48 32" stroke="#24283f" stroke-width="8" fill="none" stroke-linecap="round"/></g>' : ''}
    <path d="M-13-10v30q17 13 32-1L14-16Z" fill="#f08b54"/>
    <path d="M-33-61Q-28-92 7-89Q41-89 44-51L40-20Q37 7 12 12Q-19 12-28-13L-34-23Z" fill="url(#${id}-skin)"/>
    <path d="M-33-35C-52-47-54-17-34-15L-27-22" fill="#ffa66d"/>
    <path d="M-40-42Q-45-84-12-91Q18-104 40-78L44-59Q24-56 17-75Q3-52-24-51L-26-27-34-29Z" fill="${p.hair}"/>
    <path d="M-17-43q6-5 12-1M19-45q7-5 12 0" fill="none" stroke="${p.hair}" stroke-width="3" stroke-linecap="round"/>
    <g class="char-eyes" fill="#303347"><ellipse cx="-10" cy="-33" rx="3.2" ry="5"/><ellipse cx="26" cy="-34" rx="3.1" ry="4.8"/></g>
    <path d="m10-34 6 15-8 2" fill="none" stroke="#e17e47" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="-16" cy="-16" rx="6" ry="3.6" fill="#f59461"/>
    <path d="M-8-9Q9-2 29-13Q24 4 11 5Q0 4-8-9Z" fill="#d65c3c"/><path d="M-7-9Q11-4 28-13L24-6Q10 0-2-4Z" fill="#fff9ed"/>
    ${role === 'farmer' ? `<path d="M-44-74-32-111Q-4-126 28-110L45-75Z" fill="${p.cap}"/><path d="m-28-109 8 30h41l-8-35Q-7-119-28-109Z" fill="#ffd36c"/><path d="M-42-81Q1-91 43-81l2 12-90 4Z" fill="#e99d2e"/><path d="M-74-68Q-47-85-1-78Q41-89 67-77C92-59 35-52 0-57C-34-49-94-51-74-68Z" fill="#ffc448"/><path d="M-60-61Q-17-52 47-65" stroke="#ffdb80" stroke-width="3" fill="none"/>` : `<path d="M-41-59Q-49-100-17-111Q18-124 40-96L45-75-26-55Z" fill="${p.cap}"/><path d="M-32-97Q-8-117 12-105Q-2-96-10-71l-28 9Z" fill="${role === 'buyer' ? '#379b65' : '#ffd36c'}"/><path d="M-22-68Q23-101 54-84Q72-72 25-62L-20-56Z" fill="${role === 'buyer' ? '#206c47' : '#eea12f'}"/>`}
    ${role === 'farmer' ? '<circle cx="-34" cy="-9" r="4.2" fill="none" stroke="#ffd365" stroke-width="2.5"/>' : ''}
  </g></g>`
}

function greetingArm(role, p, id) {
  const prop = role === 'buyer'
    ? '<g class="char-prop" transform="translate(1 -6)"><rect x="-15" y="-51" width="32" height="49" rx="4" fill="#315d47" transform="rotate(8)"/><rect x="-11" y="-47" width="24" height="39" rx="2" fill="#fff9ec" transform="rotate(8)"/><path d="m-6-33 3 3 7-7m-9 16 13-2" fill="none" stroke="#79a454" stroke-width="2.4" stroke-linecap="round"/></g>'
    : role === 'carrier'
      ? '<g transform="translate(1 -8)"><g class="char-keys"><circle cy="3" r="9" fill="none" stroke="#53535d" stroke-width="4"/><path d="M2 12v24l5 1M2 26h7" fill="none" stroke="#53535d" stroke-width="4" stroke-linecap="round"/><rect x="-14" y="15" width="15" height="23" rx="5" fill="#3c4351"/><circle cx="-7" cy="22" r="2" fill="#ffca5f"/></g></g>'
      : ''
  return `<g transform="translate(229 184)"><g class="char-upper-arm">
    <path d="M-9-7Q5-15 18-1L32 29Q15 43 1 32L-15 12Z" fill="${p.shirt}"/><path d="m4 32 23-6 8 14-23 9Z" fill="${p.shade}"/>
    <path d="M16 33Q26 27 32 38L41 58Q42 66 33 71Q23 74 18 65L5 44Z" fill="#ffa66d"/>
    <g transform="translate(32 63)"><g class="char-forearm"><path d="M-10 3Q-16-12-8-26L5-51Q9-60 18-56Q26-52 21-41L9-8Q7 8-1 12Z" fill="url(#${id}-skin)"/>
      <g transform="translate(16 -49)"><g class="char-hand"><path d="M-9 0-13-13q-2-8 3-9q4-1 7 7L-7-35q-1-7 4-7q5 0 6 8l2 15 1-25q1-7 5-6q4 0 4 7l-1 24 6-19q2-6 6-4q4 2 1 9l-6 23 7-10q4-5 7-1q3 3-2 10L18 8Q3 18-9 0Z" fill="#ffa66d"/><path d="M-7-13Q6-14 6 2" stroke="#ee8c55" stroke-width="2" fill="none" stroke-linecap="round"/>${prop}</g></g>
    </g></g>
  </g></g>`
}

export function characterMarkup(role, { id, portrait = false } = {}) {
  const p = palettes[role]
  if (!p || !id || !/^[a-z0-9-]+$/i.test(id)) throw new Error('Character requires a known role and a unique safe id')
  return `<svg class="character-svg character-${role}${portrait ? ' character-portrait' : ''}" viewBox="${portrait ? '64 21 255 285' : '10 0 340 480'}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="${id}-skin" x2="1" y2=".8"><stop stop-color="#ffba80"/><stop offset="1" stop-color="#ffa16b"/></linearGradient><linearGradient id="${id}-wood" x2=".2" y2="1"><stop stop-color="#ffc46b"/><stop offset="1" stop-color="#eba14c"/></linearGradient></defs>
    <ellipse class="char-shadow" cx="184" cy="457" rx="90" ry="10" fill="#174d38" opacity=".1"/>
    <g class="char-body">
      <g transform="translate(161 310)"><g class="char-leg char-leg-left"><path d="M-24-10H14L5 110l-40-1Z" fill="#2c59ac"/><path d="m-33 96 39 4-2 15-41-1Z" fill="#4774bf"/><path d="M-34 111H4l1 25q-26 13-61 7l2-13Z" fill="${role === 'farmer' ? '#ffbf33' : '#f27643'}"/><path d="M-55 141q26 7 61-4v8q-31 12-63 3Z" fill="${role === 'farmer' ? '#ed8e25' : '#fff2dd'}"/><path d="m-37 124 19 1m-24 7 20 1" stroke="${role === 'farmer' ? '#ffd47c' : '#fff2dd'}" stroke-width="3" stroke-linecap="round"/></g></g>
      <g transform="translate(202 310)"><g class="char-leg char-leg-right"><path d="M-16-8H24l24 116-39 8Z" fill="#3261b6"/><path d="m8 100 37-7 5 17-40 9Z" fill="#4774bf"/><path d="m11 114 36-7 9 22q39 6 31 19-41 10-74-3Z" fill="${role === 'farmer' ? '#ffc13d' : '#f27643'}"/><path d="M14 141q30 9 74-1l-1 8q-41 12-74-3Z" fill="${role === 'farmer' ? '#ed8e25' : '#fff2dd'}"/><path d="m40 125 18 1m-15 6 23 1" stroke="${role === 'farmer' ? '#ffd47c' : '#fff2dd'}" stroke-width="3" stroke-linecap="round"/></g></g>
      <g class="char-torso">
        <path d="M123 176Q145 157 160 159L197 160Q221 162 238 180L227 287Q184 312 127 285Z" fill="${p.shirt}"/>
        <path d="m137 173 19-12 24 22 21-22 22 13-8 85-77 2Z" fill="${p.shade}" opacity=".5"/>
        ${role === 'farmer' ? `<path d="m143 166 16 1 5 38h38l8-36 16 6-11 54 16 94q-55 25-108-3l16-94Z" fill="#2f65bb"/><path d="M155 218h53v37q-25 21-51 0Z" fill="#2557a4"/><path d="M160 224h42v26q-21 14-40 0" fill="none" stroke="#4d83cf" stroke-width="2.5"/><circle cx="154" cy="209" r="6" fill="#ffc84d"/><circle cx="211" cy="209" r="6" fill="#ffc84d"/><path d="M178 277v43" stroke="#1e4c98" stroke-width="3"/>` : role === 'buyer' ? `<path d="m146 166 13 1 7 36h35l8-36 13 5-11 48 22 105q-54 30-113-2l24-104Z" fill="#26744b"/><path d="M150 251h55v35q-27 22-52 0Z" fill="#236844"/><path d="M172 272q-14-23-19-6q0 13 18 13q-2-23 13-23q13 8-12 23" fill="#7bab54"/><path d="m217 267 23 2-8 47-20-1" fill="#fff1d6"/><path d="m216 282 19 3m-21 8 18 3" stroke="#73917a" stroke-width="2"/>` : `<path d="m141 165 18-3 18 44-7 102-49-10 4-113Z" fill="#ffb93e"/><path d="m200 161 19 9 19 19-6 110-51 9-2-101Z" fill="#ffc34d"/><path d="m145 170 13-2 17 39-3 17-13-2Zm60 0 12 4-19 46-13 4 2-17Z" fill="#fff2be"/><path d="m124 250 47 9-1 14-48-9m63-5 49-8-1 15-48 8" fill="#fff2be"/><path d="m148 169 15 41m47-38-16 39" stroke="#ffd883" stroke-width="3"/>`}
        ${greetingArm(role, p, id)}
        ${head(role, p, id)}
        <g transform="translate(150 249)"><g class="char-carry">${produce(id)}
          <path d="M-37-65Q-52-71-63-54Q-81-21-66 4Q-57 19-30 25L-16 18Q-8 11-17 6L-41-3Q-50-5-47-16l16-33Z" fill="url(#${id}-skin)"/>
          <path d="M-39-65q-15-8-25 7l-10 18q11 15 30 14l13-23Z" fill="${p.shirt}"/>
          <path d="m-17 9 15 4m-18 3 15 4" fill="none" stroke="#ed915a" stroke-width="2" stroke-linecap="round"/>
        </g></g>
      </g>
    </g>
  </svg>`
}

export function characterBackdrop(role) {
  const setting = role === 'farmer'
    ? '<g transform="translate(34 123)"><path d="m0 36 47-35 48 35v67H0Z" fill="#dc7550"/><path d="m-4 36 51-40 52 40" fill="none" stroke="#fff4df" stroke-width="7" stroke-linejoin="round"/><path d="M30 101V54h33v47m-32-43 30 43m0-43-30 43" fill="none" stroke="#fff4df" stroke-width="4"/><path d="M37 22h20v18H37Z" fill="#fff4df"/></g>'
    : role === 'buyer'
      ? '<g transform="translate(26 140)"><path d="M6 37h100v63H6Z" fill="#d2a46a"/><path d="M18 40h78v41H18Z" fill="#f8e1af"/><path d="m-2 36 17-32h81l18 32Z" fill="#fff4df"/><path d="M13 4h18l-6 32H-2m49-32h17l4 32H43m37-32h16l18 32H91" fill="#f38e56"/><path d="M-2 36q14 13 28 0q14 13 28 0q14 13 28 0q14 13 32 0" fill="#f6d8b5"/><g fill="#80a851"><circle cx="27" cy="76" r="10"/><circle cx="50" cy="75" r="12"/></g><circle cx="77" cy="78" r="9" fill="#e87c4e"/></g>'
      : '<g transform="translate(330 160)"><g class="banner-vehicle"><path d="M-9 27h71v35H-9Z" fill="#47775d"/><path d="M62 3h26l23 29v34H60Z" fill="#fff2de"/><path d="M70 11h13l17 22H70Z" fill="#a5c8d6"/><path d="M-10 58h122v12H-10Z" fill="#50535a"/><path d="M100 46h12v12h-12Z" fill="#f6bc3d"/><g transform="translate(13 71)"><circle r="16" fill="#55525b"/><g class="banner-wheel"><circle r="9" fill="#b8a9b2"/><path d="M-6 0H6M0-6V6" stroke="#8c7d8d" stroke-width="2"/></g></g><g transform="translate(88 71)"><circle r="16" fill="#55525b"/><g class="banner-wheel"><circle r="9" fill="#b8a9b2"/><path d="M-6 0H6M0-6V6" stroke="#8c7d8d" stroke-width="2"/></g></g></g></g>'
  return `<svg class="character-banner-backdrop" viewBox="0 0 480 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M16 213Q-8 127 58 104Q53 31 129 57Q193-7 245 59Q327 13 355 83Q463 42 465 136Q502 175 465 229Z" fill="#e5edda"/><path d="M21 209Q129 136 257 194Q348 126 468 211v27H21Z" fill="#c9d9a5"/><path d="M71 212q73-44 125-11M87 227q78-43 129-8" fill="none" stroke="#e5edc9" stroke-width="6" stroke-linecap="round"/><g class="banner-cloud" fill="#fff9ec"><path d="M51 61q-2-15 13-17q6-22 24-10q15-7 20 14q17 1 15 13Z"/></g><g class="banner-cloud banner-cloud-late" fill="#fff9ec"><path d="M360 58q-2-15 13-17q6-22 24-10q15-7 20 14q17 1 15 13Z"/></g>${setting}<g class="banner-plant" fill="#96b36b"><path d="M25 239q-24-48-9-52q22-1 22 37q5-31 18-21q8 13-12 36Z"/></g><g class="banner-plant" fill="#a7bd78"><path d="M432 240q-24-48-9-52q22-1 22 37q5-31 18-21q8 13-12 36Z"/></g></svg>`
}
