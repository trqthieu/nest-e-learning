import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './configs/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('E-Learning')
    .setDescription('E learning API description')
    .setVersion('1.0')
    .addTag('E-Learning')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configuration().port;

  // const adminConfig: ServiceAccount = {
  //   projectId: process.env.FIREBASE_PROJECT_ID,
  //   privateKey: process.env.FIREBASE_PRIVATE_KEY,
  //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // };

  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig as ServiceAccount),
  //   databaseURL: process.env.FIREBASE_DATABASE_URL,
  // });
  const configService: ConfigService = app.get(ConfigService);
  const adminConfig: ServiceAccount = {
    projectId: 'e-learning-25868',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeC7VkdQy7MZLg\nqxTzMUtRzWoLUBEF3vJIw9O/5V9hdNrLIuO+yNqRleaTw8vwyk8ycSJ4QnSVhkoX\nAfT2VzlgRKL2pXevPLsgHjeUI4pflhBNXcSvoE8Bmjh802ZbMg1uG5W2kepOOXgB\n5iAXmPeIHGCKrKsqwekSpSWLA1t5HEcqr3LGF7ukOhdQUIzlvvY33J1SE6HfkoTY\nOdfyxgxnycw9F7PdtS9uc3EYlyu4DqQ9GZV1FH3vj9PtqjqSN2876Kgukgr2Jbxh\n8lirYT79RLr1btUmY4Wh41lkcmNkLLOBQ6e3u7I1i1ri+zT2DNUr0GM5zcArldA4\niPpD9dbPAgMBAAECggEAA04wt657Ba8+aH8rgP/sQ1m4eLluobYipcLyusthTfh+\nWvaagh2mn0Td/a5/+sPrGXL5oD+Y5fJZD6zKzXF65w3dxVV7Rf751Zd23MehgpOb\njlgCX79KkmNXVcUAxFzXoGXooQOMPaFAu/QZgmTV8ygkx2xfvWqGJWMEK1QhUExu\nr31eD1PLa18pR0o2IDpPlrsoMWdL2t4NldeVqjueK5QHLsUuRM/9faCSlMhw1Aog\nt878pSAz5AcEkX3Ew8lyTejF1+x62+S6YGWaQiMqRqvvQlrfMV+Isc5OfsbZlPR+\n23UN9SuYDFzrDfRDspb2fwHyqqW938tnvzM2vUZvAQKBgQDRpS5TMjkiDwf0ZDNL\nn3+aVJUTvDDjB1Rs9SGMigBLZ7qCN930n+asGXTUGtzDz/7rRAL6rXyoP12T/+OZ\n5KgqzDZaKhXQ6QThNd0i0ZjPWU5Uyr4Ic/yuc9oqG9+wGCh3/BdTR+9hPFXv9f7N\ndXC/rfZCNwRmJhBrSIy4SxtohwKBgQDA/cZQAhdc+dGkNSyt5IwX9THS8Z+FqZEv\nEPJJE90WUVSASKTiOyS+jCRtLHqaXotY/CG54xOpEcUQhL97iAqkrl/sRMxkUPDe\nMw88X74mFVrk/fc79177yR4L9+LR9rXS8AW3Ik9TeMd02TDju2Gb2OnBBjJX/c+w\npzbqOSHZeQKBgEImU7quozZq9cCYiVL4TeQdgjiK7gYEvw/uPRrCRJuGbGRASomw\nlrGBCssOetBSZgZIHISKj0XrUJStblyVuLZgX1oN43pavE5vl4owBn6OmFfK7TFv\nn7BQH+ufhfJjfQl3AsklbpQI3LjtruuXfe8NbiGwiHPO2OlxJ+3SzSArAoGAHOWi\nzRYTE3vglRrVLtB63Zd8N16wiR4DvC1oaeLMhuv0oCTAc5NxhAqN5b70OKsRaGiQ\nUDodFoKvpDKMTV3oYhIuEL2YcSjheBPjIyIe4aru6jzQySzYDxFlK1uZneC4Bvaj\nlHFRuWjrTKa8uEy1Z9WJ4rofzacWcxgGk/msBNkCgYAdq+0U88yFCD8UBtpRLJ3q\n/DbOzOz6vpXB2KrPRWl8yI9h8Fb4wpDYHbuyCO5r1fOYQQ1zevzhEe4Ue3qj7XVC\np45fs39EKoTzTXbEFSJbhEeeq5A/prI7vNh/1hLCJ9xBRF6pBuDCWoDOtvcBJKca\n50Ft8drwsrvVzjgKjtcqRQ==\n-----END PRIVATE KEY-----\n',
    clientEmail:
      'firebase-adminsdk-s9att@e-learning-25868.iam.gserviceaccount.com',
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: 'gs://e-learning-25868.appspot.com',
  });

  await app.listen(port);
}
bootstrap();
