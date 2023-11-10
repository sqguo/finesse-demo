import { Kafka } from "kafkajs"
import { KAFKA_TOPIC } from "./constants"

const kafka = new Kafka({
    clientId: 'scraper',
    brokers: ['kafka:29092'],
})

const producer = kafka.producer()

async function producePosts(posts: SocialMediaPost[]) {
    await producer.connect()
    await producer.send({
        topic: KAFKA_TOPIC,
        messages: posts.map((post) => ({
            value: JSON.stringify(post)
        })),
    })

    await producer.disconnect()
    console.log(`Enqueued ${posts.length} posts`)
}

const Producer = {
    producePosts
}

export default Producer