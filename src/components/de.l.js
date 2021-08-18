<button
className="btn btn-light"
onClick={(event) => {
  this.setState({ currentForm: 'buy' })
}}
>
BUY
</button>
<span className="text-muted">&lt; &nbsp; &gt;</span>
<button
className="btn btn-light"
onClick={(event) => {
  this.setState({ currentForm: 'sell' })
}}
>
SELL
</button>