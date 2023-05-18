# POC Network Stream

This is a basic POC demonstrating how updates to available wifi-networks (or the selected wifi networks) can be streamed using polling and multithreading.

## Problems this solves

- Polling frequently for a pseudo realtime experience, but only updating the client when there is an actual change in the data.
- Not blocking/bogging down the main thread by using `worker_threads`.

> See the detailed code comments for a full understanding of how things are working.

## Potential optimizations

- If running 2 threads is not optimal for your scenario, only slight modifications would need to be made to the `index.ts` file to make both polling workflows run on the same thread.
