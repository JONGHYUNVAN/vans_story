import { 
  Roboto_Mono, 
  Fira_Code, 
  JetBrains_Mono, 
  Source_Code_Pro,
  IBM_Plex_Mono,
  Ubuntu_Mono,
  Space_Mono,
  Inconsolata,
} from 'next/font/google'

const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code-pro' })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-ibm-plex-mono' })
const ubuntuMono = Ubuntu_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-ubuntu-mono' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-space-mono' })
const inconsolata = Inconsolata({ subsets: ['latin'], weight: ['400'], variable: '--font-inconsolata' })

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`
      ${robotoMono.variable} 
      ${firaCode.variable}
      ${jetbrainsMono.variable}
      ${sourceCodePro.variable}
      ${ibmPlexMono.variable}
      ${ubuntuMono.variable}
      ${spaceMono.variable}
      ${inconsolata.variable}
    `}>
      {children}
    </div>
  )
} 