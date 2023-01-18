## Apollo client in expo-background-fetch (android)

Application to demonstrate a problem with updating data using apollo client and expo-background-fetch

### Behavior

- Upon start of the app, the background task is registered
- About a minute after sending the app to background, the task is executed
- The apollo graphql request is reported as LOADING
- The request is held in that state. After some more minutes, more requests join, all in loading state
- When bringing the app back to front, all requests are finally resolved and report the data to the console

### Expected

The requests resolve with app in background

### Run this example

- download the repo
- install global expo-cli `npm i -g expo-cli`
- install project dependencies (I used yarn)
- run `expo run`
- Open the app in expo GO on your android smartphone
- send the app to Background, e.g. by pressing home button
- keep an eye on the console output
- after 1 or more "Task startet" outputs, bring app back to foreground
