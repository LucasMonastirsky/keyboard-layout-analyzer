import { stylesheet } from 'typestyle'
import { colors, defaults } from '../Styling'
import icon_github from '../Images/github.png'

const HeaderBar = () => {
  return (
  <div className={css.header_bar}>
    <div className={css.title}>Keyboard Layout Analyzer</div>
    <a className={css.github_container} href="https://github.com/LucasMonastirsky/keyboard-layout-analyzer">
      <img src={icon_github} className={css.icon} alt="GitHub Link" />
      <div className={css.text}>Source Code</div>
    </a>
  </div>
  )
}

const css = stylesheet({
  header_bar: {
    backgroundColor: colors.dark,
    paddingTop: defaults.margin,
    paddingBottom: defaults.margin,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: defaults.font_size_normal,
  },
  title: {
    fontSize: defaults.font_size_big,
    color: colors.light,
    marginLeft: defaults.margin,
    cursor: 'default',
  },
  github_container: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: -defaults.margin,
    marginBottom: -defaults.margin,
    padding: defaults.margin,
    transition: `background-color ${defaults.transition_time}s`,
    $nest: {
      '& > * + *': {
        marginLeft: defaults.margin,  
      },
      '&:hover': {
        backgroundColor: colors.dark_light,
      },
    }
  },
  icon: {
    height: '100%',
    maxHeight: defaults.font_size_normal + defaults.margin,
  },
  text: {
    color: colors.light,
  },
})

export default HeaderBar
