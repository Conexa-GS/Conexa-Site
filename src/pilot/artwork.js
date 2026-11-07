/* Conexa 03: original vector characters, local animation joints and shared portraits. */
export function mountArtwork() {
  const library = `<svg class="art-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <linearGradient id="orange-volume" x2=".3" y2="1"><stop stop-color="#ff9665"/><stop offset="1" stop-color="#ed613d"/></linearGradient>
    <linearGradient id="green-volume" x2="1" y2="1"><stop stop-color="#397357"/><stop offset="1" stop-color="#174d38"/></linearGradient>
    <linearGradient id="blue-volume" x2=".8" y2="1"><stop stop-color="#a9d4df"/><stop offset="1" stop-color="#6fa4b5"/></linearGradient>
    <linearGradient id="skin-warm" x2="1" y2=".7"><stop stop-color="#df9b6c"/><stop offset="1" stop-color="#c87b54"/></linearGradient>
    <linearGradient id="skin-deep" x2="1" y2="1"><stop stop-color="#b87655"/><stop offset="1" stop-color="#945037"/></linearGradient>
    <linearGradient id="glass-volume" x2="1" y2="1"><stop stop-color="#daeee6"/><stop offset="1" stop-color="#91bec5"/></linearGradient>
    <g id="leaf-mark"><path d="M-13 8Q-25-16-1-24Q17-7 3 10Q19-17 35-9Q36 16 7 20L-4 29Z" fill="currentColor"/></g>
    <g id="veg-crate" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 28C-4 10-5-6 7-9C20-15 25 5 23 15C17-12 23-25 34-23C50-20 42 8 33 23C51-1 58 0 62 9L50 35" fill="#76a854"/>
      <path d="M21 24L9 3M26 23L31-10M33 28L48 11" stroke="#477d48" stroke-width="2" fill="none"/>
      <path d="M48 29L56-2Q62-8 68-1L76 29" fill="#f3a14d"/><path d="M61-3L56-17M63-4L70-19M64-2L78-12" stroke="#397357" stroke-width="4"/>
      <circle cx="87" cy="17" r="18" fill="#ef7550"/><path d="M82 1L88 6L94 0M88 6V-3" stroke="#477d48" stroke-width="2.5" fill="none"/>
      <path d="M0 27H109L104 81H7Z" fill="#c99555"/><path d="M3 30H108L105 76H7Z" fill="#e6b86f"/>
      <path d="M10 40H100M11 54H99M13 68H97" stroke="#b68046" stroke-width="2"/><path d="M17 29V77M92 29V77" stroke="#f6d99d" stroke-width="8"/>
      <rect x="38" y="35" width="33" height="8" rx="4" fill="#9d6d3b"/><path d="M0 27H109M7 80H104" stroke="#f6d99d" stroke-width="5"/>
      <g fill="#a97545"><circle cx="17" cy="35" r="1.4"/><circle cx="92" cy="35" r="1.4"/><circle cx="17" cy="72" r="1.4"/><circle cx="92" cy="72" r="1.4"/></g>
    </g>
    <g id="head-farmer" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-31-28C-51-12-38 7-44 26C-54 48-27 57-14 43L26 42C47 41 47 15 34-2C40-39 14-52-8-45Z" fill="#213c32"/>
      <path d="M-13 19L-15 46Q0 58 18 45L13 19" fill="#c47b53"/><path d="M-12 21L13 24L14 35Q-4 37-12 27" fill="#ad6246"/>
      <path d="M-27-20C-24-43 18-42 29-18L26 6C25 24 12 34-2 30C-18 27-26 14-27-20" fill="url(#skin-warm)"/>
      <path d="M-28-4C-45-18-43 11-26 11" fill="#da9464"/><path d="M-32-1Q-38-4-34 5" fill="none" stroke="#ab6145" stroke-width="2"/>
      <path d="M-29-21Q-12-18-3-37Q6-25 29-22L28-35L-23-42Z" fill="#213c32"/>
      <path d="M-12-10Q-7-13-2-10M12-10Q17-13 21-10" fill="none" stroke="#593f31" stroke-width="2.2"/>
      <g class="eyes" fill="#263d32"><ellipse cx="-6" cy="-4" rx="2.2" ry="3"/><ellipse cx="17" cy="-4" rx="2.2" ry="3"/></g>
      <path d="M7-4L10 6L5 8" fill="none" stroke="#af6549" stroke-width="1.7"/><ellipse cx="-14" cy="10" rx="5" ry="2.8" fill="#ed9b75"/>
      <path d="M-5 15Q7 20 18 13Q9 30-5 15" fill="#fff9ec"/><circle cx="-29" cy="15" r="4.8" stroke="#f3c45e" stroke-width="2.8" fill="none"/>
      <path d="M-34-35L-26-61Q-7-74 15-63L31-39Z" fill="#efc66f"/><path d="M-19-61Q-13-66 3-63L12-41H-25Z" fill="#ffdc8a"/>
      <path d="M-33-42Q-3-48 27-43L31-35L-35-31Z" fill="#b97b43"/>
      <path d="M-56-35Q-37-44-4-39Q29-44 49-35C63-20 22-17-4-21C-30-18-66-23-56-35" fill="#efc66f"/>
      <path d="M-48-30Q-17-24 9-27Q34-29 45-30" fill="none" stroke="#dca953" stroke-width="2"/>
    </g>
    <g id="head-buyer" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-15 17L-17 45Q2 56 19 42L14 16" fill="#9b573c"/><path d="M-15 20Q-1 32 16 24L17 34Q-1 40-15 26" fill="#814431"/>
      <path d="M-29-23Q-22-48 8-39Q32-37 29-11L27 11Q22 32 5 32Q-18 33-25 10Z" fill="url(#skin-deep)"/>
      <path d="M-26-5C-44-18-42 12-25 11" fill="#ae6c4e"/><path d="M-31-1Q-36-4-33 5" stroke="#7e4634" stroke-width="2" fill="none"/>
      <path d="M-29-3Q-39-8-34-25Q-45-42-27-47Q-24-60-11-53Q2-66 12-51Q30-58 32-42Q47-35 32-21Q16-16 8-28Q-5-16-23-23L-24-3Z" fill="#263c33"/>
      <path d="M-22-40Q-18-47-10-43M3-48Q9-48 13-42" stroke="#49614e" stroke-width="2" fill="none"/>
      <g class="eyes" fill="#273b32"><ellipse cx="-10" cy="-3" rx="2" ry="3"/><ellipse cx="17" cy="-3" rx="2" ry="3"/></g>
      <g stroke="#223e33" stroke-width="2.6" fill="none"><rect x="-24" y="-13" width="25" height="21" rx="8"/><rect x="5" y="-13" width="25" height="21" rx="8"/><path d="M1-5H5M-24-6L-31-9"/></g>
      <path d="M5 1L7 10L2 12" fill="none" stroke="#834832" stroke-width="1.5"/><path d="M-4 18Q8 23 20 15Q12 31-4 18" fill="#fff9ec"/>
      <path d="M-23 16Q-19 31 0 35Q19 38 27 19Q23 40 5 42Q-19 40-23 16" fill="#263c33" opacity=".65"/>
    </g>
    <g id="head-driver" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-15 19L-17 44Q0 55 19 43L14 18" fill="#ce895e"/><path d="M-15 21L15 25L16 33Q-2 38-15 29" fill="#ba714e"/>
      <path d="M-29-24Q-10-43 24-25L28 4Q25 29 4 31Q-23 32-27 8Z" fill="#e3a474"/>
      <path d="M-27-5Q-43-16-39 3Q-36 13-25 10" fill="#d99061"/><path d="M-32-2Q-37-4-33 4" stroke="#b87350" stroke-width="2" fill="none"/>
      <path d="M-31-21L-23-23L-22-4L-29 2Z" fill="#3b4637"/>
      <g class="eyes" fill="#273d32"><ellipse cx="-7" cy="-4" rx="2" ry="3"/><ellipse cx="16" cy="-4" rx="2" ry="3"/></g>
      <path d="M-12-12L-3-13M12-13L21-11" stroke="#6b4b35" stroke-width="2" fill="none"/><path d="M6-4L9 6L5 8" stroke="#bb7752" stroke-width="1.5" fill="none"/>
      <path d="M-9 15Q-2 6 5 12Q13 5 23 12Q21 20 6 17Q-3 22-9 15" fill="#3b4637"/><path d="M2 23Q8 26 13 22" stroke="#9e5f43" stroke-width="1.7" fill="none"/>
      <path d="M-34-25Q-38-57-9-59Q24-61 29-28Z" fill="#397357"/><path d="M-9-57Q-21-47-18-28L-32-27Q-36-51-9-57" fill="#588b62"/>
      <path d="M-35-29Q-9-33 30-30L47-24Q52-19 42-18L-34-20Z" fill="#174d38"/><path d="M-7-48L4-48L8-37L-6-37Z" fill="#d4eb88"/>
    </g>
    <g id="little-plant" stroke-linecap="round">
      <path d="M1 0Q-7-45 9-80" fill="none" stroke="#397357" stroke-width="3"/>
      <path d="M-2-16C-25-12-39-31-33-44C-11-44-1-33-2-16M1-39C20-32 35-49 31-64C12-63 3-53 1-39M7-63C-5-67-11-85-3-95C12-88 14-77 7-63" fill="#79a360"/>
      <path d="M-3-19L-25-35M4-43L25-57" fill="none" stroke="#4d8050" stroke-width="1.5"/>
      <path d="M-24-8H24L18 27Q0 32-18 27Z" fill="#de9a67"/><path d="M8-8H24L18 27Q11 30 6 29Z" fill="#c98053"/><rect x="-27" y="-13" width="54" height="10" rx="3" fill="#edb17c"/>
    </g>
    <g id="wheel-v3"><circle r="27" fill="#243e34"/><circle r="22" fill="#3b5549"/><circle r="16" fill="#c4d6cc"/><circle r="11" fill="#ecf1df"/>
      <g stroke="#8ca69a" stroke-width="3" stroke-linecap="round"><path d="M0-11V-7M0 7V11M-11 0H-7M7 0H11M-8-8L-5-5M5 5L8 8M8-8L5-5M-5 5L-8 8"/></g><circle r="4" fill="#577567"/>
    </g>
    <g id="parcel"><path d="M0 8L32 0L61 10V49L29 58L0 46Z" fill="#e4b375"/><path d="M29 18L61 10V49L29 58Z" fill="#c99459"/><path d="M0 8L29 18L61 10L32 0Z" fill="#f0cb91"/><path d="M19 3L49 13V25L40 28V16L11 6Z" fill="#fff0c9"/><path d="M6 33L19 37M6 38L14 40" stroke="#b67f49" stroke-width="2"/></g>
  </defs></svg>`;
  document.body.insertAdjacentHTML('afterbegin', library);

  const depot = `<svg viewBox="0 0 600 520" aria-hidden="true" class="station-art">
    <path d="M69 370C30 287 75 179 160 171C180 80 317 62 384 119C500 96 572 205 542 319C548 423 436 456 317 451C195 466 101 448 69 370" fill="#eaf0d8"/>
    <circle cx="445" cy="130" r="41" fill="#f6cf74"/>
    <g class="cloud-one" fill="#fff9ec"><path d="M83 157C64 157 65 137 80 135C77 111 115 105 123 125C144 118 160 131 157 143C177 142 179 157 163 157Z"/></g>
    <path d="M75 433C187 401 465 406 545 434C455 467 173 478 75 433" fill="#b8cfa8" opacity=".5"/>
    <g class="depot-building" stroke-linejoin="round">
      <path d="M210 228L376 190L527 258V418L373 448L210 411Z" fill="#b4d1d3"/><path d="M373 266L527 258V418L373 448Z" fill="#7fa8ae"/>
      <path d="M210 228L376 151L527 258L373 286Z" fill="#dce8df"/><path d="M192 232L375 140L548 258L527 271L375 166L211 247Z" fill="#245540"/>
      <path d="M375 140L548 258L537 267L374 154L201 239L192 232Z" fill="#4c7c58"/>
      <path d="M244 282L340 302V437L244 418Z" fill="#3f6661"/><path d="M253 297L331 313V428L253 412Z" fill="#284b43"/><path d="M253 297L331 313V348L253 332Z" fill="#91b7b9"/>
      <g stroke="#668e90" stroke-width="2"><path d="M253 306L331 322M253 315L331 331M253 324L331 340"/></g>
      <path d="M236 417L343 438L350 448L236 425Z" fill="#e2dfbe"/>
      <path d="M400 300L493 282V341L400 359Z" fill="#4c7474"/><path d="M406 305L487 290V336L406 351Z" fill="url(#glass-volume)"/>
      <path d="M446 298V345M408 329L434 300M449 340L483 297" stroke="#edf3e6" stroke-width="3" fill="none"/><path d="M400 372L493 354M400 385L493 367M400 398L493 380" stroke="#6e969b" stroke-width="2"/>
      <path d="M219 252L356 279V302L219 275Z" fill="#fff9ec"/><g transform="translate(237 267) scale(.2)" style="color:#397357"><use href="#leaf-mark"/></g><path d="M253 269L340 286" stroke="#668970" stroke-width="4" stroke-linecap="round"/>
      <use href="#parcel" transform="translate(283 375) scale(.7)"/><use href="#parcel" transform="translate(320 394) scale(.63)"/>
    </g>
    <g class="plant-sway" transform="translate(534 411)"><use href="#little-plant" transform="scale(.7)"/></g>
    <g class="depot-person" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="169" cy="448" rx="48" ry="7" fill="#597b57" opacity=".17"/>
      <path d="M144 331L138 386L134 436L153 438L170 383L178 341Z" fill="#244e40"/><path d="M168 338L175 391L187 438L207 434L198 380L194 331Z" fill="#366451"/>
      <path d="M149 349L145 388M182 363L186 392" stroke="#517b62" stroke-width="2" fill="none"/>
      <path d="M134 430L151 431L151 441L133 451H112Q106 448 111 443L130 436Z" fill="#2c4539"/><path d="M113 450H151" stroke="#f7e9c8" stroke-width="3"/>
      <path d="M186 430L204 429L208 439L225 445Q229 449 222 451H185Z" fill="#2c4539"/><path d="M186 450H224" stroke="#f7e9c8" stroke-width="3"/>
      <g class="driver-body">
        <path d="M147 239Q133 243 127 274L121 307Q121 319 136 320L153 288Z" fill="#6a9fae"/>
        <path d="M145 235Q169 223 193 240L203 328Q176 345 139 331L138 271Z" fill="url(#blue-volume)"/>
        <path d="M148 239L167 250L181 236L190 242L176 260L165 251L156 261L145 247" fill="#d3e5e1"/>
        <path d="M168 253V298" stroke="#6795a0" stroke-width="2"/><path d="M179 268H193V287Q185 293 179 286Z" fill="#d0e3dd"/>
        <g class="driver-clipboard"><path d="M125 279L158 268L181 320L147 334Z" fill="#42644e"/><path d="M130 283L155 275L174 317L149 327Z" fill="#f8eccd"/><path d="M137 278L148 274L151 280L140 284Z" fill="#d4b77b"/>
        <path d="M140 295L159 289M144 303L162 297M147 311L161 307" stroke="#b3bca3" stroke-width="2"/><path d="M129 305Q145 297 152 299L160 309Q159 318 153 314L146 310L134 319Q125 320 124 313Z" fill="#dfa072"/></g>
        <g class="driver-gesture"><path d="M192 243Q206 243 210 265L217 291L241 274L248 286L218 310Q207 315 201 303L187 272Z" fill="#8dbcc8"/>
        <path d="M234 279L243 268L243 257Q245 251 248 257L251 270L261 263Q267 262 266 267L255 282L245 289Z" fill="#dfa072"/><path d="M201 273L206 292" stroke="#6795a0" stroke-width="2" fill="none"/></g>
        <g transform="translate(169 211) scale(.64)"><g class="driver-head"><use href="#head-driver"/></g></g>
      </g>
    </g>
    <g transform="translate(94 407) scale(.62)" class="plant-sway"><use href="#little-plant"/></g>
    <g class="connection-pin" transform="translate(112 217) scale(.8)"><path d="M0-20C-37-60-23-85-2-85C25-85 36-57 0-20" fill="#ff8253"/><circle cx="-1" cy="-62" r="10" fill="#fff9ec"/></g>
    <path d="M389 106V94M383 100H395" stroke="#89a76b" stroke-width="2" stroke-linecap="round"/>
  </svg><span class="place-label">Transportadora</span><i class="dock" aria-hidden="true"></i>`;

  const farm = `<svg viewBox="0 0 600 520" aria-hidden="true" class="station-art">
    <path d="M39 381C6 282 64 163 160 159C203 78 327 90 379 151C479 119 548 211 545 303C574 409 480 460 340 461C196 482 71 457 39 381" fill="#eaf0d3"/>
    <circle cx="431" cy="142" r="32" fill="#f4d180"/>
    <path d="M42 365Q156 279 291 339Q435 256 556 361L535 438Q346 496 68 442Z" fill="#d1e4a3"/><path d="M51 386Q182 318 333 367Q443 321 552 377L544 407Q405 364 330 393Q161 351 57 411Z" fill="#bdd68d"/>
    <g fill="none" stroke="#9dbd70" stroke-width="2.5"><path d="M62 427Q166 362 300 405M78 441Q177 383 291 424M354 395Q439 360 547 408M357 414Q447 381 537 425M371 433Q453 401 526 440"/></g>
    <g class="farm-building"><path d="M352 268L417 223L487 262V362L418 384L352 365Z" fill="#edc595"/><path d="M418 276L487 262V362L418 384Z" fill="#d5aa7b"/>
      <path d="M352 268L417 223L418 276Z" fill="#f8e4be"/><path d="M340 271L417 214L498 260L487 270L417 230L352 281Z" fill="#d87952"/><path d="M417 214L498 260L490 265L417 223L346 276L340 271Z" fill="#ef9b6c"/>
      <path d="M374 365V311Q395 297 411 317V380Z" fill="#50765a"/><path d="M383 319L402 324V370L383 366Z" fill="#365c46"/>
      <path d="M440 294L470 287V319L440 326Z" fill="#7aa4a0"/><path d="M455 291V322M440 308L470 301" stroke="#f8e4be" stroke-width="3"/>
      <path d="M355 351L371 355M354 342L366 345M425 351L481 336" stroke="#bc9065" stroke-width="2"/>
    </g>
    <g stroke="#9ca976" stroke-width="6" stroke-linecap="round"><path d="M68 352L168 376M68 376L168 401M81 340V409M121 350V420M159 362V431"/></g>
    <g fill="#77a052"><path d="M87 401Q54 378 62 359Q89 361 87 401M89 399Q86 371 108 367Q116 391 89 399M484 417Q458 388 470 373Q495 384 484 417M487 416Q488 386 511 387Q515 410 487 416"/></g>
    <g class="farmer" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="258" cy="474" rx="63" ry="8" fill="#446840" opacity=".15"/>
      <path d="M224 340L214 402L207 456L233 461L254 397L264 350Z" fill="#24533e"/><path d="M253 347L260 407L275 459L301 456L294 392L289 336Z" fill="#32674b"/>
      <path d="M231 364L227 402M272 365L277 398L288 438" stroke="#4b7f59" stroke-width="2" fill="none"/>
      <path d="M207 451L233 456L232 469L209 476H183Q178 471 186 466L202 460Z" fill="#c38153"/><path d="M184 474H230" stroke="#704f37" stroke-width="4"/>
      <path d="M274 451L300 451L302 463L319 469Q326 475 315 477H275Z" fill="#c38153"/><path d="M277 475H319" stroke="#704f37" stroke-width="4"/>
      <g class="farmer-torso">
        <path d="M221 229Q199 230 190 259L182 288Q177 304 190 315L221 334L230 320L202 296L212 267Z" fill="url(#skin-warm)"/>
        <path d="M221 227Q201 227 192 249L188 268L211 279L224 253Z" fill="#f18a59"/><path d="M190 268L212 277" stroke="#d56a43" stroke-width="3"/>
        <path d="M220 230Q250 216 278 231L291 289L289 351Q250 362 216 349L216 283Z" fill="url(#orange-volume)"/>
        <path d="M227 231L231 269H271L273 231L282 236L281 278L291 350Q253 365 215 350L222 279L218 235Z" fill="url(#green-volume)"/>
        <path d="M237 289H269V311Q254 321 237 311Z" fill="#46805a"/><path d="M240 292H266M226 334Q250 340 281 333" stroke="#70a275" stroke-width="1.5" fill="none"/>
        <circle cx="231" cy="273" r="3" fill="#f4cf7c"/><circle cx="274" cy="273" r="3" fill="#f4cf7c"/>
        <path d="M216 318Q226 311 230 316L238 325Q240 330 235 330L230 325Q233 336 225 336L218 332L211 327Z" fill="#dc9363"/>
        <g transform="translate(276 240)"><g class="farmer-arm"><path d="M-1-10Q15-12 23 5L31 28L18 41L2 25L-5 10Z" fill="#f18151"/>
          <path d="M20 25L33 33L55 8L65 17L42 52Q35 62 24 53L10 37Z" fill="url(#skin-warm)"/><path d="M17 26L31 35" stroke="#d26b45" stroke-width="3" fill="none"/>
          <g transform="translate(55 2)"><g class="farmer-hand"><path d="M-4 11C-7 7-9 2-11-3L-16-14C-17-18-14-20-11-17L-4-8L-4-27C-4-31 0-32 1-28L3-13L6-32C7-36 11-35 11-31L10-13L16-29C18-33 22-31 21-27L17-10L24-22C27-25 30-22 28-18L21-3C18 4 15 9 11 13L8 17L-1 17Z" fill="#db9465"/>
            <path d="M-5-6C1-6 5-2 5 3M6-12L6-7M12-12L11-7M18-9L16-5" stroke="#b97652" stroke-width="1.3" fill="none"/>
          </g></g>
        </g></g>
        <g transform="translate(251 203) scale(.68)"><g class="farmer-head"><use href="#head-farmer"/></g></g>
      </g>
    </g>
    <g id="farm-supply" transform="translate(357 383) scale(.72)"><use href="#veg-crate"/></g>
    <g class="plant-sway" transform="translate(507 435) scale(.65)"><use href="#little-plant"/></g>
    <g class="bird" fill="none" stroke="#638568" stroke-width="2" stroke-linecap="round"><path d="M101 195Q110 185 119 195Q128 185 137 195M321 139Q327 132 333 139Q339 132 345 139"/></g>
  </svg><span class="place-label">Produtor rural</span><i class="dock" aria-hidden="true"></i><i class="cargo-source" aria-hidden="true"></i>`;

  const market = `<svg viewBox="0 0 600 520" aria-hidden="true" class="station-art">
    <path d="M44 366C11 258 73 159 175 158C214 95 339 88 390 146C491 126 556 210 551 319C567 427 473 468 326 463C172 479 69 450 44 366" fill="#e6eee0"/>
    <g fill="#cbded1"><path d="M79 328V192H114V168H149V200H176V328ZM435 331V178H467V150H493V186H524V331Z"/></g>
    <g fill="#e8f0e5"><path d="M93 208H104V224H93ZM118 208H129V224H118ZM93 241H104V257H93ZM118 241H129V257H118ZM452 202H464V219H452ZM479 202H491V219H479ZM452 235H464V252H452ZM479 235H491V252H479Z"/></g>
    <ellipse cx="325" cy="453" rx="212" ry="17" fill="#b6cdb9" opacity=".55"/>
    <g class="market-building" stroke-linejoin="round">
      <path d="M151 264H403V442H151Z" fill="#f1d6a0"/><path d="M403 264L441 279V431L403 442Z" fill="#d6b787"/>
      <rect x="166" y="278" width="222" height="150" rx="3" fill="#ddbf89"/><rect x="174" y="289" width="123" height="127" rx="2" fill="url(#glass-volume)"/>
      <path d="M180 354L235 294M212 403L291 317" stroke="#dcece2" stroke-width="8" opacity=".65"/><path d="M235 291V412M174 357H297" stroke="#fff2d3" stroke-width="5"/>
      <path d="M316 427V309Q349 279 378 309V427Z" fill="#446f58"/><path d="M326 419V314Q349 293 368 314V419Z" fill="#2b5341"/><rect x="357" y="358" width="4" height="21" rx="2" fill="#edca85"/>
      <rect x="171" y="408" width="130" height="12" rx="2" fill="#c89963"/><rect x="145" y="433" width="264" height="10" rx="3" fill="#d3b58a"/>
      <path d="M137 276L165 217H394L420 276Z" fill="#fff2d6"/><path d="M165 217H199L183 276H137ZM231 217H264L261 276H222ZM297 217H329L340 276H300ZM362 217H394L420 276H379Z" fill="#f18154"/>
      <path d="M137 275V289Q160 311 183 289V275M222 275V289Q242 311 261 289V275M300 275V289Q320 311 340 289V275M379 275V289Q400 311 420 289V275" fill="#e76e49"/>
      <path d="M183 275V289Q203 311 222 289V275M261 275V289Q281 311 300 289V275M340 275V289Q360 311 379 289V275" fill="#f4e3c0"/>
      <path d="M138 276H419" stroke="#b87850" stroke-width="2" opacity=".55"/><rect x="201" y="166" width="151" height="39" rx="8" fill="#fff4db"/><rect x="205" y="170" width="143" height="31" rx="6" fill="none" stroke="#d5b98a"/>
      <text x="277" y="190" text-anchor="middle" class="art-label">MERCADO</text>
      <g transform="translate(183 381) scale(.4)"><use href="#veg-crate"/></g><g transform="translate(240 381) scale(.4)"><use href="#veg-crate"/></g><path d="M174 421H300" stroke="#b48656" stroke-width="2"/>
    </g>
    <g class="buyer" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="475" cy="474" rx="60" ry="8" fill="#375d47" opacity=".14"/>
      <path d="M449 344L438 404L434 454L457 458L477 391L481 348Z" fill="#284e3d"/><path d="M473 350L482 405L500 458L524 451L514 394L508 342Z" fill="#375f48"/>
      <path d="M453 363L450 402M491 369L497 399" stroke="#517a5a" stroke-width="2" fill="none"/>
      <path d="M434 450L456 454L455 468L433 476H410Q406 471 413 466L430 458Z" fill="#f7edd8"/><path d="M411 475H455" stroke="#37614a" stroke-width="4"/>
      <path d="M500 451L520 447L524 460L541 467Q547 474 538 476H500Z" fill="#f7edd8"/><path d="M501 474H540" stroke="#37614a" stroke-width="4"/>
      <g class="buyer-torso">
        <path d="M450 234Q424 239 419 269L411 301L427 307L445 279Z" fill="#ad6a4c"/><path d="M449 230Q430 233 423 250L418 270L439 278L452 251Z" fill="#bedb80"/>
        <path d="M448 231Q473 221 498 235L511 291L508 352L443 352L439 281Z" fill="#d4eb88"/>
        <path d="M456 234L459 267H489L491 234L499 239L497 271L513 358Q473 373 436 358L450 270L447 237Z" fill="url(#orange-volume)"/>
        <path d="M455 287H492V315Q476 324 455 315Z" fill="#e27246"/><path d="M459 290H488M446 345Q474 352 502 345" stroke="#f9b281" stroke-width="1.5" fill="none"/>
        <circle cx="457" cy="269" r="2.7" fill="#ffe1a8"/><circle cx="491" cy="269" r="2.7" fill="#ffe1a8"/>
        <g transform="translate(422 296)"><g class="buyer-phone"><path d="M-4 0L-17-18L-9-25L6-11L13-13L19-7L12 5Q3 12-4 0" fill="#b67652"/>
          <rect x="-27" y="-52" width="24" height="42" rx="5" fill="#254e3c" transform="rotate(-12 -15 -31)"/><path d="M-22-43L-9-46L-3-21L-17-18Z" fill="#c8e0d0"/>
          <path d="M-16-31L-12-28L-7-36" stroke="#518059" stroke-width="2" fill="none"/><path d="M-12-15L-17-26Q-16-31-12-27L-7-18L1-12L-2-5" fill="#b67652"/>
        </g></g>
        <g transform="translate(500 247)"><g class="buyer-arm"><path d="M-9-12Q9-8 16 11L24 34L10 44L-2 22Z" fill="#c4df85"/>
          <path d="M14 33L27 35L32 61Q33 70 23 75L0 85L-7 74L15 61L9 42Z" fill="url(#skin-deep)"/><path d="M-2 73Q-11 71-15 77L-18 88Q-14 92-12 85L-7 83L-9 91Q-7 96-3 91L4 80" fill="#ae6b4c"/>
        </g></g>
        <g transform="translate(474 204) scale(.67)"><g class="buyer-head"><use href="#head-buyer"/></g></g>
      </g>
    </g>
    <g id="market-supply" transform="translate(323 405) scale(.68)" opacity="0"><use href="#veg-crate"/></g>
    <g class="plant-sway" transform="translate(113 426) scale(.8)"><use href="#little-plant"/></g>
    <g transform="translate(403 153)"><g class="delivery-check"><circle r="25" fill="#397357"/><circle r="20" fill="none" stroke="#62956b"/><path d="M-10 0L-3 7L12-9" fill="none" stroke="#e2efa5" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g></g>
  </svg><span class="place-label">Mercado</span><i class="dock" aria-hidden="true"></i><i class="cargo-destination" aria-hidden="true"></i>`;

  const truck = `<svg viewBox="-160 -170 320 200" class="truck-svg" aria-hidden="true" overflow="visible">
    <ellipse id="truck-shadow" cx="0" cy="19" rx="142" ry="10" fill="#254e38" opacity=".13"/>
    <g id="truck-facing"><g id="truck-suspension" stroke-linejoin="round" stroke-linecap="round">
      <path d="M-145-91H14V-70H-145Z" fill="#b95435"/>
      <g id="truck-cargo"><use href="#veg-crate" transform="translate(-127 -146) scale(.68)"/><use href="#veg-crate" transform="translate(-57 -137) scale(.55)"/></g>
      <path d="M-150-91H17V-135Q17-149 32-149H72Q89-149 99-132L123-92L143-85Q151-81 151-70V-31Q151-24 142-24H-143Q-151-24-151-32Z" fill="url(#orange-volume)"/>
      <path d="M24-133Q24-140 33-140H71Q79-140 86-128L108-91H24Z" fill="#284f43"/><path d="M32-133H68Q76-132 81-122L96-97H32Z" fill="url(#glass-volume)"/><path d="M36-131H47L35-104H32V-119Z" fill="#f2f5de" opacity=".8"/>
      <g transform="translate(63 -112) scale(.36)"><path d="M-32 41Q-35 13-16 10H18Q35 18 35 41Z" fill="#7cabb8"/><use href="#head-driver"/></g>
      <path d="M70-100L83-106L93-98" fill="none" stroke="#315746" stroke-width="3"/>
      <path d="M28-88H108L109-33H28Z" fill="#f18254"/><path d="M30-87V-35H107" fill="none" stroke="#cf5e39" stroke-width="1.5"/>
      <path d="M-150-91H17V-82H-150Z" fill="#ffb780"/><path d="M-146-79H11V-39H-146Z" fill="#f58758"/><path d="M-141-75H5M-141-42H5" stroke="#ffb282" stroke-width="1.5"/>
      <path d="M-147-31H146V-19H-147Z" fill="#355342"/><path d="M-132-23A34 34 0 0 1-64-23M72-23A34 34 0 0 1 140-23" fill="#254638"/>
      <path d="M-132-25A34 34 0 0 1-64-25M72-25A34 34 0 0 1 140-25" fill="none" stroke="#ffaf79" stroke-width="5"/>
      <rect x="41" y="-81" width="17" height="4" rx="2" fill="#8a5036"/><rect x="104" y="-100" width="15" height="10" rx="4" fill="#315743"/><path d="M105-90L105-86" stroke="#315743" stroke-width="3"/>
      <path d="M137-77H151V-61H135Q131-69 137-77" fill="#ffe6a5"/><path d="M145-57H152M145-51H152" stroke="#b45a36" stroke-width="2"/>
      <rect x="139" y="-34" width="17" height="9" rx="3" fill="#a1b3a4"/><rect x="-155" y="-53" width="8" height="17" rx="2" fill="#d9593b"/><rect x="-154" y="-52" width="6" height="6" rx="1" fill="#ffd995"/><rect x="-156" y="-32" width="17" height="8" rx="3" fill="#a1b3a4"/>
      <g transform="translate(-68 -59) scale(.34)" style="color:#fff4d7"><use href="#leaf-mark"/></g><path d="M-111-61H-94M-109-55H-94" stroke="#ffd4a6" stroke-width="2"/>
    </g>
    <g transform="translate(-98 -8)"><g class="truck-wheel"><use href="#wheel-v3"/></g></g><g transform="translate(106 -8)"><g class="truck-wheel"><use href="#wheel-v3"/></g></g>
    <g id="speed-strokes" stroke="#77966b" stroke-width="2" stroke-linecap="round" fill="none"><path d="M-169-61H-187M-172-44H-199M-168-28H-181"/></g>
    </g>
  </svg>`;
  document.querySelector('[data-art="depot"]').innerHTML = depot;
  document.querySelector('[data-art="farm"]').innerHTML = farm;
  document.querySelector('[data-art="market"]').innerHTML = market;
  document.querySelector('#truck-rig').innerHTML = truck;
  document.querySelector('#flying-cargo').innerHTML = '<svg viewBox="0 -28 110 112" aria-hidden="true"><use href="#veg-crate"/></svg>';
  document.querySelectorAll('[data-portrait]').forEach(el => {
    el.innerHTML = '<svg viewBox="-66 -82 132 140" aria-hidden="true"><path d="M-58 75V55Q-55 30-20 28L0 42L20 28Q55 30 58 55V75Z" fill="'+(el.dataset.portrait === 'buyer' ? '#ef8051' : el.dataset.portrait === 'driver' ? '#8ab8c5' : '#397357')+'"/><use href="#head-'+el.dataset.portrait+'"/></svg>';
  });
}