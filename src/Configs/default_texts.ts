const default_texts = {
  twitter:
`Mum's delighted the sun is out, the birds are singing and she's got the washing on the line!! Sun with faceSeedling Face with rolling eyes It's the little things that make Mum happy Rolling on the floor laughingRolling on the floor laughing #dogsoftwitter #happy #mondaythoughts

Meet petite SmokeyTwo hearts9mo old. Pls RT to help her find a House with garden #VA #DC. Super sweet loves affection. #cat #cats #catsofinstagram #CatsOfTwitter #SundayMotivation #AdoptDontShop #RescueCats #ValentinesDay #valentinesday2021 #SundayThoughts #catlover #mondaythoughts #MondayMorning #pets

It's been a good day. Despite it being my first day out of work. I'm feeling ok. No plans yet. Taking a few weeks off to think about what I want to do. No rush. Being made redundant could be a blessing in disguise. I like to think so.
❤ #MondayThoughts`,
  javascript:
`import { Keyboard } from '../Models/Keyboard'
import replace_special_chars from './replace_special_chars'

const simulate = (keyboard: Keyboard, text: string): ISimulation => {
  const simulation: ISimulation = { heatmap: {}, total_heat: 0, max_heat: 0 }
  const char_counts: { [char: string]: number } = {}

  // count the amount of each character and the total
  let caps_lock: boolean = false
  const text_split = text.split('')
  text_split.forEach((char, index) => {
    if (caps_lock && /[a-z]/.test(char)) {
      char_counts['CAPS'] = (char_counts['CAPS'] || 0) + 1
      caps_lock = false
    }
    else if (!caps_lock && /[A-Z]/.test(char)) { 
      if (/[A-Z]/.test(text_split[index + 1])) { // if the next char is upper case, press CAPS
        char_counts['CAPS'] = (char_counts['CAPS'] || 0) + 1
        caps_lock = true
      }
      else char_counts['SHIFT'] = (char_counts['SHIFT'] || 0) + 1 // else press SHIFT
    }

    char = replace_special_chars(char)
    char = char.toUpperCase()
    char_counts[char] = (char_counts[char] || 0) + 1
    simulation.total_heat++
  })

  // add heat to each key in each char's binds
  Object.keys(char_counts).forEach(char => {
    if (['CAPS', 'SHIFT'].includes(char))
      simulation.heatmap[keyboard.modifiers[char][0]] = (simulation.heatmap[keyboard.modifiers[char][0]] || 0) + char_counts[char]
    else if (!keyboard.binds[char])
      console.warn(\`char \${char} not found on this keyboard\`)
    else keyboard.binds[char][0].forEach(key => {
      simulation.heatmap[key] = (simulation.heatmap[key] || 0) + char_counts[char]
      if (simulation.heatmap[key] > simulation.max_heat)
        simulation.max_heat = simulation.heatmap[key]
    })
  })

  return simulation
}

/** Contains data about a specific keyboard's
 * effectiveness on a specific text.
 * 
 * 'heat' represents an amount of keypresses
 */
interface ISimulation {
  /** indexed by key id, contains the heat for each key */
  heatmap: { [index: number]: number },
  /** combined heat of all keys */
  total_heat: number,
  /** the highest heat value amongst all keys */
  max_heat: number,
}

export type { ISimulation } 
export default simulate
  `,
  books:
`How long did I sit on the stairs after reading the letter? I don't know. For I was spellbound. There is something about words. In expert hands, manipulated deftly, they take you prisoner. Wind themselves around your limbs like spider silk, and when you are so enthralled you cannot move, they pierce your skin, enter your blood, numb your thoughts. Inside you they work their magic. When I at last woke up to myself, I could only guess what had been going on in the darkness of my unconsciousness. What had the letter done to me?

I knew very little about Vida Winter. I was aware naturally of the various epithets that usually came attached to her name: England's best-loved writer; our century's Dickens; the world's most famous living author; and so on. I knew of course that she was popular, though the figures, when I later researched them, still came as a surprise. Fifty-six books published in fifty-six years; they are translated into forty-nine languages; Miss Winter has been named twenty-seven times the most borrowed author from English libraries; nineteen feature films have been based on her novels. In terms of statistics, the most disputed question is this: Has she or has she not sold more books than the Bible? The difficulty comes less from working out how many books she has sold (an ever-changing figure in the millions) than in obtaining solid figures for the Bible -- whatever one thinks of the word of God, his sales data are notoriously unreliable. The figure that might have interested me the most, as I sat there at the bottom of the stairs, was twenty-two. This was the number of biographers who, for want of information, or lack of encouragement, or after inducements or threats from Miss Winter herself, had been persuaded to give up trying to discover the truth about her. But I knew none of this then. I knew only one statistic, and it was one that seemed relevant: How many books by Vida Winter had I, Margaret Lea, read? None.

I shivered on the stairs, yawned and stretched. Returning to myself, I found that my thoughts had been rearranged in my absence. Two items in particular had been selected out of the unheeded detritus that is my memory and placed for my attention.

The first was a little scene involving my father. A box of books we are unpacking from a private library clearance includes a number of Vida Winters. At the shop we don't deal in contemporary fiction. "I'll take them to the charity shop in my lunch hour," I say, and leave them on the side of the desk. But before the morning is out, three of the four books are gone. Sold. One to a priest, one to a cartographer, one to a military historian. Our clients' faces, with the customary outward paleness and inner glow of the book lover, seem to light up when they spot the rich colors of the paperback covers. After lunch, when we have finished the unpacking and the cataloging and the shelving and we have no customers, we sit reading as usual. It is late autumn, it is raining and the windows have misted up. In the background is the hiss of the gas heater; we hear the sound without hearing it for, side by side, together and miles apart, we are deep in our books.

"Shall I make tea?" I ask, surfacing.

No answer.

I make tea all the same and put a cup next to him on the desk.

An hour later the untouched tea is cold. I make a fresh pot and put another steaming cup beside him on the desk. He is oblivious to my every movement.

Gently I tilt the volume in his hands so that I can see the cover. It is the fourth Vida Winter. I return the book to its original position and study my father's face. He cannot hear me. He cannot see me. He is in another world, and I am a ghost.

That was the first memory.

The second is an image. In three-quarter profile, carved massively out of light and shade, a face towers over the commuters who wait, stunted, beneath. It is only an advertising photograph pasted on a billboard in a railway station, but to my mind's eye it has the impassive grandeur of long-forgotten queens and deities carved into rock faces by ancient civilizations. To contemplate the exquisite arc of the eye; the broad, smooth sweep of the cheekbones; the impeccable line and proportions of the nose, is to marvel that the randomness of human variation can produce something so supernaturally perfect as this. Such bones, discovered by the archaeologists of the future, would seem an artifact, a product not of blunt-tooled nature but of the very peak of artistic endeavor. The skin that embellishes these remarkable bones has the opaque luminosity of alabaster; it appears paler still by contrast with the elaborate twists and coils of copper hair that are arranged with such precision about the fine temples and down the strong, elegant neck.

As if this extravagant beauty were not enough, there are the eyes. Intensified by some photographic sleight of hand to an inhuman green, the green of glass in a church window, or of emeralds or of boiled sweets, they gaze out over the heads of the commuters with perfect inexpression. I can't say whether the other travelers that day felt the same way as I about the picture; they had read the books, so they may have had a different perspective on things. But for me, looking into the large green eyes, I could not help being reminded of that commonplace expression about the eyes being the gateway to the soul. This woman, I remember thinking, as I gazed at her green, unseeing eyes, does not have a soul.

Such was, on the night of the letter, the extent of my knowledge about Vida Winter. It was not much. Though on reflection perhaps it was as much as anyone else might know. For although everyone knew Vida Winter -- knew her name, knew her face, knew her books -- at the same time nobody knew her. As famous for her secrets as for her stories, she was a perfect mystery.

Now, if the letter was to be believed, Vida Winter wanted to tell the truth about herself. This was curious enough in itself, but curiouser still was my next thought: Why should she want to tell it to me?`,

}

export default default_texts