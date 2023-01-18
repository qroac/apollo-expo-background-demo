import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import createApolloClient from './createApolloClient';
import gql from 'graphql-tag';

const FETCH_TASK = 'background-fetch';

if (!TaskManager.isTaskDefined(FETCH_TASK)) {
  TaskManager.defineTask(FETCH_TASK, async ({ executionInfo }) => {
    try {
      console.log('Task started')
      const client = await createApolloClient({apiUrl: 'https://fruits-api.netlify.app/graphql'})
      const query = gql`{ fruit(id:3) {fruit_name, family} }`;
      const result = await client.query({ query, fetchPolicy: 'network-only' });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
      console.log(e.message)
    }
  });
}

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default function App() {
  React.useEffect(() => {
    TaskManager.isTaskRegisteredAsync(FETCH_TASK).then(async (isRegistered) => {
      const registerTask = async () => {
        await BackgroundFetch.registerTaskAsync(FETCH_TASK, {
          minimumInterval: 60, // trigger every minute
          stopOnTerminate: false,
          startOnBoot: true,
        }).then(() => {
          console.log('Task registered');
        });
      };
      if (isRegistered) {
        await BackgroundFetch.unregisterTaskAsync(FETCH_TASK).then(async () => {
          await registerTask();
        });
      } else {
        await registerTask();
      }
    });
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get a shareable url.
      </Text>
      <Card>
        <AssetExample />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
