import "./Home.css";

function Home() {
  return (
    <main className="home_root">
      <section className="home_top">
        <h1>Greetings and salutations, {`<name>`}!</h1>
        <p>I hope life is treating you fair, you deserve it</p>
        <p>What's cookin', good lookin'?</p>
        <p>Oh, yoooouhoooo!</p>
        <p>Why, hello there {`<name>`}!</p>
        <p>Greetings, Earthling!</p>
        <p>A royal decree of hello!</p>
        <p>Well, butter my biscuit if it isn't the town's finest!</p>
        <p>Aloha, {`<name>`}</p>
        <p>Konnichiwa, {`<name>`}</p>
        <p>Hello, babycakes!</p>
        <p>Hello {`<name>`}, this is the computer speaking, wishing you a good day</p>
      </section>
    </main>
  );
}

export default Home;
