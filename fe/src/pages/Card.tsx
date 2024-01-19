import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Card = (props: Props) =>{
  return(
    <div className="m-5 pt-5 pb-5 shadow-md overflow-hidden bg-white"
    >{props.children}</div>
  )
}

export default Card