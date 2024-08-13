const Languageoption = (props) => {
  return(
      <div style={{marginTop:'50px'}}>
          <select onChange={props.onChange}>
          <option>Select Language</option>
          <option value={'en'}>English</option>
          <option value={'ko'}>Korean</option>
          <option value={'chi'}>Chinese</option>
          <option value={'hi'}>Hindi</option>
          <option value={'es'}>Spanish</option>
          <option value={'fr'}>French</option>
          <option value={'de'}>German</option>
          <option value={'ja'}>Japanese</option>
          <option value={'ru'}>Russian</option>
          <option value={'ar'}>Arabic</option>
          <option value={'pt'}>Portuguese</option>
          <option value={'it'}>Italian</option>
          <option value={'bn'}>Bengali</option>
          <option value={'ur'}>Urdu</option>
          <option value={'vi'}>Vietnamese</option>
          <option value={'ms'}>Malay</option>
          </select>
      </div>
  )
}
export default Languageoption;