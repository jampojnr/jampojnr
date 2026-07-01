export const LANGUAGES = [
  { id: "en", label: "English", flag: "🇬🇧", speech: "en-US" },
  { id: "twi", label: "Twi", flag: "🇬🇭", speech: "ak-GH" },
  { id: "ga", label: "Ga", flag: "🇬🇭", speech: "gaa-GH" },
  { id: "hausa", label: "Hausa", flag: "🇬🇭", speech: "ha-GH" },
  { id: "fr", label: "Français", flag: "🇫🇷", speech: "fr-FR" },
  { id: "es", label: "Español", flag: "🇪🇸", speech: "es-ES" },
];

export const HAZARD_SUMMARIES = {
  flood: {
    en: "Water levels are rising fast. Move to high ground now. Do not walk or drive through flood water. Keep your family together and listen for official instructions.",
    twi: "Nsuo no rekɔ soro ntɛm. Kɔ baabi a ɛkorɔn seesei ara. Nnantew anaa nnka kaa wɔ nsuyiri mu. Fa w'abusua ka wo ho na tie aban amanneɛbɔ.",
    ga: "Nu lɛ miiho oya. Yaa he ko ni kwɔ amrɔ nɛɛ. Kaanyiɛ loo kaaku tsɔne yɛ nu mli. Bo kɛ oweku lɛ ahi ekome ni nyɛbo amaniɛbɔɔ lɛ toi.",
    hausa: "Ruwa yana hauhawa da sauri. Matsa zuwa tudu yanzu. Kada ka yi tafiya ko tuki cikin ambaliyar ruwa. Ka kasance tare da iyalinka kuma ka saurari umarnin hukuma.",
    fr: "Le niveau de l'eau monte rapidement. Rejoignez immédiatement un terrain élevé. Ne marchez pas et ne conduisez pas dans les eaux de crue. Restez en famille et suivez les consignes officielles.",
    es: "El nivel del agua sube rápidamente. Vaya a un terreno elevado ahora. No camine ni conduzca por el agua de la inundación. Mantenga a su familia unida y siga las instrucciones oficiales.",
  },
  wildfire: {
    en: "A dangerous fire is spreading nearby. Prepare to leave quickly. Close windows, take your emergency bag, and follow the marked evacuation routes.",
    twi: "Ogya a ɛyɛ hu retrɛtrɛ wɔ mpɔtam ha. Siesie wo ho na tumi fi hɔ ntɛm. To mpoma mu, fa wo nkwagye bag, na di akwan a wɔakyerɛ no akyi.",
    ga: "La ni naa gbeyei miishwere yɛ he nɛɛ. Saamɔ ohe ni oshi oya. Ŋamɔ samfɛji lɛ, ŋɔɔ o emergency baagi lɛ, ni onyiɛ gbɛjianɔ ni akadi lɛ nɔ.",
    hausa: "Wata gobara mai hatsari tana yaduwa kusa. Shirya barin wurin da sauri. Rufe tagogi, dauki jakar gaggawa, kuma bi hanyoyin kwashe mutane da aka nuna.",
    fr: "Un incendie dangereux se propage à proximité. Préparez-vous à partir rapidement. Fermez les fenêtres, prenez votre sac d'urgence et suivez les itinéraires d'évacuation balisés.",
    es: "Un incendio peligroso se está extendiendo cerca. Prepárese para salir rápidamente. Cierre las ventanas, tome su bolsa de emergencia y siga las rutas de evacuación señalizadas.",
  },
  heat: {
    en: "Extreme heat is here. Drink water often, stay in the shade or a cooling center, and check on children and the elderly every few hours.",
    twi: "Ahuhuro kɛse aba. Nom nsuo mpɛn pii, tena onwunu mu anaa baabi a ɛdwo, na hwɛ mmɔfra ne mpanyimfo so bere biara.",
    ga: "Latsãa kpeteŋkpele eba. Numɔ nu shii abɔ, hiɛ hɔɔŋ mli loo he ko ni jɔ, ni okwɛ gbekɛbii kɛ onukpai anɔ ŋmɛlɛtswaa fɛɛ mli.",
    hausa: "Zafi mai tsanani ya zo. Sha ruwa akai-akai, zauna a inuwa ko cibiyar sanyaya, kuma duba yara da tsofaffi kowane sa'o'i kadan.",
    fr: "Une chaleur extrême est là. Buvez de l'eau souvent, restez à l'ombre ou dans un centre de rafraîchissement, et vérifiez les enfants et les personnes âgées régulièrement.",
    es: "El calor extremo ha llegado. Beba agua con frecuencia, permanezca a la sombra o en un centro de enfriamiento, y revise a los niños y ancianos cada pocas horas.",
  },
  storm: {
    en: "A severe storm is coming. Stay indoors away from windows. Charge your phone, secure loose objects outside, and avoid travel until it passes.",
    twi: "Ahum kɛse reba. Tena fie na twe wo ho fi mpoma ho. Hyɛ wo fon, siesie nneɛma a ɛwɔ abɔnten, na nntu kwan kosi sɛ ɛbɛtwam.",
    ga: "Ahum kpeteŋkpele miiba. Hiɛ shia mli ni otsi ohe kɛjɛ samfɛji ahe. Wo o fon lɛ, saamɔ nibii ni yɔɔ agbo naa, ni kaafã gbɛ kɛyashi ebaaho.",
    hausa: "Guguwa mai tsanani tana zuwa. Ku zauna a cikin gida nesa da tagogi. Caji wayarka, tsare kayan waje, kuma guji tafiya har sai ta wuce.",
    fr: "Une tempête violente arrive. Restez à l'intérieur, loin des fenêtres. Chargez votre téléphone, sécurisez les objets à l'extérieur et évitez les déplacements jusqu'à son passage.",
    es: "Se acerca una tormenta severa. Quédese adentro, lejos de las ventanas. Cargue su teléfono, asegure los objetos sueltos afuera y evite viajar hasta que pase.",
  },
  earthquake: {
    en: "Earthquake risk is active. If shaking starts: drop, cover, and hold on. Stay away from heavy shelves and be ready for aftershocks.",
    twi: "Asasewosow ho asiane wɔ hɔ. Sɛ asase fi ase wosow a: butuw fam, kata wo ti so, na kura mu. Twe wo ho fi nneɛma a emu yɛ duru ho na siesie wo ho ma nea edi akyi.",
    ga: "Shikpoŋhosomɔ gbeyei yɛ he nɛɛ. Kɛ shikpoŋ lɛ bɔi hosomɔ lɛ: kula shi, ha onɔ, ni omɔmɔ mli. Tsi ohe kɛjɛ nibii tsiitsii ahe ni osaa ohe kɛha nɔ ni baanyiɛ sɛɛ.",
    hausa: "Hadarin girgizar kasa yana nan. Idan girgiza ta fara: fadi kasa, rufe kanka, ka rike. Nisanci manyan kaya masu nauyi kuma shirya don karin girgiza.",
    fr: "Le risque sismique est actif. Si les secousses commencent : baissez-vous, abritez-vous et tenez bon. Éloignez-vous des étagères lourdes et préparez-vous aux répliques.",
    es: "El riesgo sísmico está activo. Si comienza el temblor: agáchese, cúbrase y sujétese. Aléjese de estanterías pesadas y prepárese para las réplicas.",
  },
  tornado: {
    en: "A tornado may form in your area. Go to the lowest room with no windows. Protect your head and stay there until the all-clear is given.",
    twi: "Ahum kyinhyia betumi aba wo mpɔtam. Kɔ dan a ɛwɔ fam a mpoma nni mu no mu. Bɔ wo ti ho ban na tena hɔ kosi sɛ wɔbɛka sɛ ɛho tew.",
    ga: "Ahum kukui baanyɛ eba oŋɔɔ he nɛɛ. Yaa tsũ ni yɔɔ shishi ni samfɛ ko bɛ mli lɛ mli. Buu oyitso he ni ohiɛ jɛmɛ kɛyashi amɛbaakɛɛ ehe etse.",
    hausa: "Guguwar iska mai karfi na iya tasowa a yankinku. Je dakin da ke kasa mara tagogi. Kare kanka kuma ka zauna a can har sai an ba da sanarwar kwanciyar hankali.",
    fr: "Une tornade peut se former dans votre zone. Allez dans la pièce la plus basse sans fenêtres. Protégez votre tête et restez-y jusqu'à la fin de l'alerte.",
    es: "Un tornado puede formarse en su área. Vaya a la habitación más baja sin ventanas. Proteja su cabeza y quédese allí hasta que se dé el aviso de seguridad.",
  },
};

export const MODE_LABELS = {
  text: { icon: "📖", label: "Text Mode", sub: "Simple written summary" },
  audio: { icon: "🔊", label: "Audio Mode", sub: "Voice warning broadcast" },
  visual: { icon: "📡", label: "Visual Mode", sub: "Animated hazard radar" },
};
