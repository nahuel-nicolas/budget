import './Box.css'

const Box = (props) => (
    <div className='box' isdisplay={props.isBoxDisplayed.toString()}>
        {props.children}
    </div>
)
    
export default Box