/** Simula latencia de red con un delay aleatorio entre min y max ms */
export const delay = (min = 300, max = 800): Promise<void> =>
  new Promise((resolve) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min
    setTimeout(resolve, ms)
  })
