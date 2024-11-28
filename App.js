import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

// Sparkle animation component
const SparkleEffect = ({ show }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (show && animationRef.current) {
      animationRef.current.play();
    }
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.sparkleContainer}>
      <LottieView
        ref={animationRef}
        source={require('./assets/sparkle.json')}
        autoPlay
        loop={false}
        style={styles.sparkle}
      />
    </View>
  );
};

// Confetti animation component
const Confetti = ({ show }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (show && animationRef.current) {
      animationRef.current.play();
    }
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.confettiContainer}>
      <LottieView
        ref={animationRef}
        source={require('./assets/confetti.json')}
        autoPlay
        loop={false}
        style={styles.confetti}
      />
    </View>
  );
};

// Different emoji themes
const EMOJI_THEMES = {
  animals: ['🐶', '🐱', '🐼', '🐨', '🦊', '🐯', '🦁', '🐸'].flatMap(emoji => [emoji, emoji]),
  food: ['🍕', '🍔', '🌮', '🍣', '🍎', '🍇', '🍦', '🍪'].flatMap(emoji => [emoji, emoji]),
  sports: ['⚽️', '🏀', '🎾', '⚾️', '🏈', '🏸', '🎱', '🎯'].flatMap(emoji => [emoji, emoji]),
  nature: ['🌸', '🌺', '🌻', '🌹', '🌴', '🌈', '⭐️', '🌙'].flatMap(emoji => [emoji, emoji])
};

// Card back designs
const CARD_BACKS = {
  classic: {
    symbol: '?',
    color: '#2196F3'
  },
  stars: {
    symbol: '⭐️',
    color: '#673AB7'
  },
  hearts: {
    symbol: '❤️',
    color: '#E91E63'
  },
  sparkles: {
    symbol: '✨',
    color: '#FF9800'
  }
};

// Enhanced Card component with animations
const Card = ({ emoji, isFlipped, onPress, isMatched, cardBack }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const matchedAnimation = useRef(new Animated.Value(1)).current;
  const bounceAnimation = useRef(new Animated.Value(1)).current;
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    // Flip animation
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    // Match animation
    if (isMatched) {
      setShowSparkle(true);
      Animated.sequence([
        Animated.spring(matchedAnimation, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(matchedAnimation, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start(() => {
        setTimeout(() => setShowSparkle(false), 1000);
      });
    }
  }, [isFlipped, isMatched]);

  // Hover/Touch animation
  const handlePressIn = () => {
    Animated.spring(bounceAnimation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(bounceAnimation, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.cardContainer}>
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [
              { scale: Animated.multiply(matchedAnimation, bounceAnimation) }
            ],
          },
        ]}
      >
        <TouchableOpacity 
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isFlipped || isMatched}
          style={styles.cardTouchable}
        >
          <Animated.View 
            style={[
              styles.card, 
              styles.cardFront, 
              { backgroundColor: CARD_BACKS[cardBack].color },
              { transform: [{ rotateY: frontInterpolate }] }
            ]}
          >
            <Text style={styles.cardText}>{CARD_BACKS[cardBack].symbol}</Text>
          </Animated.View>
          <Animated.View 
            style={[
              styles.card, 
              styles.cardBack, 
              { transform: [{ rotateY: backInterpolate }] }
            ]}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
      <SparkleEffect show={showSparkle} />
    </View>
  );
};


export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('animals');
  const [currentCardBack, setCurrentCardBack] = useState('classic');
  const [showVictoryConfetti, setShowVictoryConfetti] = useState(false);
  
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const flipSound = useRef(null);
  const matchSound = useRef(null);
  const victorySound = useRef(null);

  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: flip } = await Audio.Sound.createAsync(
          require('./assets/flip.mp3')
        );
        const { sound: match } = await Audio.Sound.createAsync(
          require('./assets/match.mp3')
        );
        const { sound: victory } = await Audio.Sound.createAsync(
          require('./assets/victory.mp3')
        );
        
        flipSound.current = flip;
        matchSound.current = match;
        victorySound.current = victory;
      } catch (error) {
        console.log('Error loading sounds:', error);
      }
    }

    loadSounds();

    return () => {
      if (flipSound.current) flipSound.current.unloadAsync();
      if (matchSound.current) matchSound.current.unloadAsync();
      if (victorySound.current) victorySound.current.unloadAsync();
    };
  }, []);

  const playSound = async (soundRef) => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const animateBackground = () => {
    Animated.sequence([
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const startGame = () => {
    const shuffledEmojis = [...EMOJI_THEMES[currentTheme]]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isMatched: false,
      }));
    
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(true);
    setShowVictoryConfetti(false);
  };

  const handleCardPress = async (index) => {
    if (flippedIndices.length === 2) return;
    
    await playSound(flipSound);
    setFlippedIndices(prev => [...prev, index]);
    setMoves(moves + 1);
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        playSound(matchSound);
        animateBackground();
        setMatchedPairs(prev => [...prev, cards[firstIndex].emoji]);
        setCards(prev => prev.map((card, index) => 
          index === firstIndex || index === secondIndex
            ? { ...card, isMatched: true }
            : card
        ));
      }
      
      setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
    }
  }, [flippedIndices]);

  useEffect(() => {
    if (gameStarted && matchedPairs.length === EMOJI_THEMES[currentTheme].length / 2) {
      const showVictory = async () => {
        await playSound(victorySound);
        setShowVictoryConfetti(true);
        
        if (highScore === null || moves < highScore) {
          setHighScore(moves);
        }

        Alert.alert(
          "Congratulations! 🎉",
          `You won in ${moves} moves!\n${highScore ? `Best: ${highScore} moves` : ''}`,
          [
            { text: "Play Again", onPress: startGame }
          ]
        );
      };

      showVictory();
    }
  }, [matchedPairs]);

  const backgroundColor = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f0f0f0', '#E8F5E9']
  });

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Memory Game</Text>
          
          <View style={styles.optionsContainer}>
            <Text style={styles.optionTitle}>Choose Theme:</Text>
            <View style={styles.themeButtons}>
              {Object.keys(EMOJI_THEMES).map(theme => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeButton,
                    currentTheme === theme && styles.themeButtonSelected
                  ]}
                  onPress={() => setCurrentTheme(theme)}
                >
                  <Text style={styles.themeButtonText}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.optionTitle}>Card Back:</Text>
            <View style={styles.cardBackButtons}>
              {Object.entries(CARD_BACKS).map(([name, design]) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.cardBackButton,
                    currentCardBack === name && styles.cardBackButtonSelected,
                    { backgroundColor: design.color }
                  ]}
                  onPress={() => setCurrentCardBack(name)}
                >
                  <Text style={styles.cardBackButtonText}>{design.symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={startGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            backgroundColor: backgroundColor
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.moves}>Moves: {moves}</Text>
          {highScore && (
            <Text style={styles.highScore}>Best: {highScore} moves</Text>
          )}
        </View>
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              emoji={card.emoji}
              isFlipped={flippedIndices.includes(index) || card.isMatched}
              isMatched={card.isMatched}
              cardBack={currentCardBack}
              onPress={() => handleCardPress(index)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={startGame}>
          <Text style={styles.resetButtonText}>Reset Game</Text>
        </TouchableOpacity>
      </Animated.View>
      <Confetti show={showVictoryConfetti} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
    marginVertical: 20,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  themeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  themeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  themeButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardBackButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  cardBackButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardBackButtonSelected: {
    borderColor: '#4CAF50',
  },
  cardBackButtonText: {
    fontSize: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 20,
  },
  cardContainer: {
    margin: 4,
    height: CARD_SIZE,
    width: CARD_SIZE,
  },
  cardWrapper: {
    flex: 1,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#2196F3',
  },
  cardBack: {
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 24,
    color: '#fff',
  },
  emojiText: {
    fontSize: 32,
  },
  moves: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  highScore: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confetti: {
    width: '100%',
    height: '100%',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    width: '150%',
    height: '150%',
  },
});