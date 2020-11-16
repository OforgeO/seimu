import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

const styles = StyleSheet.create({
  cardMain: {
    flex: 1,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

// = ({ isModalVisible, children }) =>
export class Task extends React.Component {
  render() {
    const { isModalVisible, children } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => null}
      >
        <View
          style={[styles.container,
            {
              ...Platform.select({
                android: {
                  // paddingTop: shouldMove ? 240 : null,
                },
              }),
            },
          ]}
        >
          <View style={styles.cardMain}>{children}</View>
        </View>
      </Modal>
    );
  }
}
