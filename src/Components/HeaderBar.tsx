import { Component } from 'react'
import layouts from '../Configs/default_layouts'
import { cssRaw, style, stylesheet } from 'typestyle'
import { colors, defaults } from '../Styling'
import icon_github from '../Images/github.png'

export default class HeaderBar extends Component<{}, {selectedLayout: string}> {
  constructor(props: any) {
    super(props)
    this.state = { selectedLayout: layouts.qwerty_sixty_percent }
  }

  handleLayoutChange = (event: {target: {value: string }}): void => {
    this.setState({selectedLayout: event.target.value})
  }

  render(): JSX.Element {
    return (
    <div className={css.header_bar}>
      <a className={css.github_container} href="https://github.com/LucasMonastirsky/keyboard-layout-analyzer">
        <img src={icon_github} className={css.icon} />
        <div className={css.text}>Source Code</div>
      </a>
    </div>
    )
  }
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
