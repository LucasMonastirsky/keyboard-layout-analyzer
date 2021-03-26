import { Keyboard } from '../Models/Keyboard'
import readLayout from '../Logic/read_layout'

const default_layouts: Keyboard[] = [
  readLayout(
    'ESC,`,,,~|1,!|2,@|3,#|4,$|5,%|6,^|7,&|8,*|9,(|0,)|-,_|=,+|BKS w:2\n' +
    'TAB w:1.5|Q|W|E|R|T|Y|U|I|O|P|[,{|],}|\\,BAR w:1.5\n' +
    'CAPS w:1.75|A|S|D|F|G|H|J|K|L|;,:|\',"|ENTER w:2.25\n' +
    'SHIFT w:2.25|Z|X|C|V|B|N|M|COMMA,<|.,>|/,?|SHIFT w:2.75\n' +
    'CTRL w:1.25|OS w:1.25|ALT w:1.25|SPACE w:6.25|ALT w:1.25|OPT w:1.25|CTRL w:1.25|FN w:1.25',
    'Qwerty 60%'),
  readLayout(
    'TAB,,,,`,~|Q,,,,1,!|W,,,,2,@|E,,,,3,#|R,,,,4,$|T,,,,5,%|Y,,,,6,^|U,,,,7,&|I,,,,8,*|O,,,,9,(|P,,,,0,)|BKS\n' +
    'CTRL,,,,,ESC|A,,,,F1|S,,,,F2|D,,,,F3|F,,,,F4|G,,,,F5|H,,,,F6|J,,,,-,_|K,,,,=,+|L,,,,[,{|;,,,,],}|\',,,,\\,BAR\n' +
    'SHIFT|Z,,,,F7|X,,,,F8|C,,,,F9|V,,,,F10|B,,,,F11|N,,,,F12|M|COMMA|.|/|ENTER\n' +
    'MISC|CTRL|ALT|OS|FN|SPACE w:2|FN2|MISC|MISC|MISC|MISC',
    'Qwerty 40%'),
  readLayout(
    '`,~|1,!|2,@|3,#|4,$|5,%|6,^|7,&|8,*|9,(|0,)|[,{|],}|BKS w:2\n' +
    `TAB w:1.5|',"|COMMA,<|.,>|P|Y|F|G|C|R|L|/,?|=,+|\\,BAR w:1.5\n` +
    `CAPS w:1.75|A|O|E|U|I|D|H|T|N|S|-,_|ENTER w:2.25\n` +
    `SHIFT w:2.25|;,:|Q|J|K|X|B|M|W|V|Z|SHIFT w:2.75\n` +
    'CTRL w:1.25|OS w:1.25|ALT w:1.25|SPACE w:6.25|ALT w:1.25|OPT w:1.25|CTRL w:1.25|FN w:1.25',
    'Dvorak 60%'
  ),
  readLayout(
    'TAB,,,,~,`|",,,,!,1|COMMA,,,,@,2|.,,,,#,3|P,,,,$,4|Y,,,,%,5|F,,,,^,6|G,,,,&,7|C,,,,*,8|R,,,,(,9|L,,,,),0|BKS\n' +
    'ESC|A|O|E|U|I|D|H,,,,_,-|T,,,,+,=|N,,,,{,[|S,,,,},]|/,,,,BAR,\\\n' +
    'SHIFT|;|Q|J|K|X|B|M|W|V|Z|ENTER\n' +
    'MISC|CTRL|ALT|MISC|FN|SPACE w:2|FN2|MISC|MISC|MISC|MISC',
    'Dvorak 40%'
  ),
  readLayout(
    'MISC x:0.5|=,-,+,*|J|P|Y|F|G,,,,5|N,,,,6|R,,,,7|L,,,,8|\',",`,,9|BKS\n' +
    'CAPS|U|O|I|E|A|?,!,&,BAR|D,,,,0|T,,,,1|S,,,,2|C,,,,3|H,,,,4|ENTER\n' +
    'SHIFT x:0.75|Q|K|X|B|COMMA,.,;,:,^ w:1.5|M,,,,@|W,,,,#|V,,,,$|Z,,,,%|MISC\n' +
    'FN x:0.5|CTRL|ALT|OS|{,(,[,<|SPACE,_,TAB,ESC w:2|},),],>|MISC|MISC|MISC|MISC',
    'Custom Programmer Layout'
  ),
]

export default default_layouts