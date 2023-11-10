import { Kafka } from "kafkajs"
import { ANALYZER_LABELS, ANALYZER_THRESHOLD, KAFKA_TOPIC } from "./config";


const kafka = new Kafka({
    clientId: 'scraper',
    brokers: ['kafka:29092'],
})

const consumer = kafka.consumer({ groupId: 'analyzer' })

const Analyzer = async (): Promise<void> => {

    // multi-label classification for caption
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;
    const pipe = await pipeline('zero-shot-classification');

    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC });

    // log to console for now
    // TODO: use kafka sink to write to database
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value) {
                const post: SocialMediaPost = JSON.parse(message.value.toString());
                if (post.caption.trim().length === 0) return;
                const output = await pipe(post.caption, ANALYZER_LABELS, { multi_label: true });
                if (output.scores[0] < ANALYZER_THRESHOLD) return
                console.log('FOUND FASHION POST:', output.scores)
                console.log(post)
            }

        },
    });
}

export default Analyzer;

