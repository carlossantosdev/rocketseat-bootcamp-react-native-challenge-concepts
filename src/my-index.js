import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import api from './services/api';

// Não possuem valor semântico (significado)
// Não possuem estilização própria
// Todos componentes possuem por padrão "display: flex"

// View: div, footer, header, main, aside, section
// Text: p, span, strong, h1, h2, h3

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => setRepositories(response.data));
  }, [repositories]);

  async function handleAddProject() {
    const response = await api.post('repositories', {
      title: `Novo repositório por App ${Date.now()}`,
      url: 'App Mobile',
      techs: ['NodeJS', 'ReactJS'],
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleAddLike(id) {
    await api.post(`/repositories/${id}/like`);
    let oldRepositories = repositories;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id,
    );

    if (repositoryIndex) {
      oldRepositories[repositoryIndex].likes += 1;
    }

    const newRepositories = oldRepositories;

    setRepositories(newRepositories);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.repositoryList}
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({item: repository}) => (
            <>
              <View style={styles.repositoryListContent}>
                <Text style={styles.repositoryListTitle}>
                  {repository.title}
                </Text>
                <View style={styles.repositoryListLikes}>
                  <Text style={styles.repositoryListLikesText}>
                    {repository.likes}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.repositoryListDoLike}
                  onPress={() => handleAddLike(repository.id)}>
                  <Text style={styles.repositoryListDoLikeText}>Curtir</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.repositoryListTechContent}>
                {repository.techs.map((tech) => (
                  <Text style={styles.repositoryListTechContentText}>
                    {tech}
                  </Text>
                ))}
              </View>
            </>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button}
          onPress={handleAddProject}>
          <Text style={styles.buttonText}>Adicionar projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryList: {
    marginTop: 20,
  },
  repositoryListContent: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  repositoryListTitle: {
    flex: 1,
    color: '#7159c1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  repositoryListLikes: {
    minHeight: 43,
    height: 'auto',
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    color: '#fff',
  },
  repositoryListLikesText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  repositoryListDoLike: {
    minHeight: 43,
    height: 'auto',
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    color: '#fff',
    marginLeft: 10,
  },
  repositoryListDoLikeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  repositoryListTechContent: {
    backgroundColor: '#fff',
    opacity: 0.6,
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  repositoryListTechContentText: {
    marginHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
