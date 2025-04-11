// import React, { useState, useEffect } from 'react';
// import { Music, VolumeX, PauseCircle, PlayCircle, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Quotes from '../../Assets/Data/Quotes.json';
// import Meditation from "../../Assets/Music/Meditation.mp3"
// import Rain from "../../Assets/Music/Rain.mp3"
// import bird from "../../Assets/Music/birds.wav"
// import ocean from "../../Assets/Music/ocean.wav"
// import forest from "../../Assets/Music/forest.wav"

// // Game cards for memory game (slightly expanded set)
// const gameCards = ["🌸", "🌿", "🌊", "🌙", "⭐", "🌈", "🔮", "🍃"];

// // Available sounds for relaxation
// const soundOptions = [
//   { name: "Meditation", icon: "🧘", color: "bg-sky-50" },
//   { name: "Rain", icon: "🌧️", color: "bg-sky-100" },
//   { name: "Ocean", icon: "🌊", color: "bg-blue-50" },
//   { name: "Forest", icon: "🌲", color: "bg-emerald-50" },
//   { name: "White Noise", icon: "📻", color: "bg-slate-50" }
// ];

// // Bubble colors for Bubble Pop game
// const bubbleColors = [
//   "from-pink-300 to-pink-200",
//   "from-blue-300 to-blue-200",
//   "from-purple-300 to-purple-200",
//   "from-green-300 to-green-200",
//   "from-yellow-300 to-yellow-200",
//   "from-indigo-300 to-indigo-200",
// ];

// export default function MentalHealth() {
//   const [musicPlaying, setMusicPlaying] = useState(false);
//   const [currentQuote, setCurrentQuote] = useState(Quotes[0]);
//   const [breathePhase, setBreathePhase] = useState("inhale");
//   const [activeTab, setActiveTab] = useState("breathing");
//   const [cards, setCards] = useState([]);
//   const [flippedCards, setFlippedCards] = useState([]);
//   const [matchedCards, setMatchedCards] = useState([]);
//   const [selectedSound, setSelectedSound] = useState(null);
//   const [showQuote, setShowQuote] = useState(true);
//   const [bubbles, setBubbles] = useState([]);
//   const [score, setScore] = useState(0);
//   const [gameActive, setGameActive] = useState(false);
//   const [showCelebration, setShowCelebration] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(60);

//   // Change quote every 12 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const randomIndex = Math.floor(Math.random() * Quotes.length);
//       setCurrentQuote(Quotes[randomIndex]);
//     }, 12000);
//     return () => clearInterval(interval);
//   }, []);

//   // Breathing exercise timing
//   useEffect(() => {
//     if (activeTab === "breathing") {
//       const breathingInterval = setInterval(() => {
//         setBreathePhase(prev => prev === "inhale" ? "hold" : prev === "hold" ? "exhale" : "inhale");
//       }, breathePhase === "hold" ? 3000 : 4000);
//       return () => clearInterval(breathingInterval);
//     }
//   }, [breathePhase, activeTab]);

//   // Initialize memory game
//   useEffect(() => {
//     if (activeTab === "memory") {
//       const cardPairs = [...gameCards, ...gameCards].slice(0, 16); // Ensure we have 8 pairs (16 cards)
//       setCards(cardPairs.map((card, index) => ({
//         id: index,
//         content: card,
//         isFlipped: false,
//         isMatched: false
//       })).sort(() => Math.random() - 0.5));
//       setFlippedCards([]);
//       setMatchedCards([]);
//       setShowCelebration(false);
//     }
//   }, [activeTab]);

//   // Handle card flipping in memory game
//   useEffect(() => {
//     if (flippedCards.length === 2) {
//       const [firstCard, secondCard] = flippedCards;
//       if (cards[firstCard].content === cards[secondCard].content) {
//         setMatchedCards(prev => [...prev, firstCard, secondCard]);
//       }
//       const timer = setTimeout(() => {
//         setFlippedCards([]);
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [flippedCards, cards]);

//   // Check for memory game completion and show celebration
//   useEffect(() => {
//     if (matchedCards.length === cards.length && cards.length > 0) {
//       setTimeout(() => {
//         setShowCelebration(true);
//       }, 800);
//     }
//   }, [matchedCards.length, cards.length]);

//   // Handle Bubble Pop game
//   useEffect(() => {
//     if (activeTab === "bubblePop" && gameActive) {
//       // Create new bubbles more slowly (every 2 seconds)
//       const bubbleInterval = setInterval(() => {
//         if (bubbles.length < 8) { // Reduced max bubbles from 10 to 8
//           const newBubble = {
//             id: Date.now(),
//             x: Math.random() * 80 + 10, // 10-90% of container width
//             y: 100, // Start at bottom
//             size: Math.random() * 40 + 30, // 30-70px
//             color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
//             speed: Math.random() * 1 + 0.5, // Reduced speed: 0.5-1.5px per frame (was 1-3px)
//           };
//           setBubbles(prev => [...prev, newBubble]);
//         }
//       }, 2000); // Increased from 1000ms to 2000ms

//       // Move bubbles upward more slowly
//       const animationFrame = setInterval(() => {
//         setBubbles(prevBubbles => 
//           prevBubbles
//             .map(bubble => ({
//               ...bubble,
//               y: bubble.y - bubble.speed,
//             }))
//             .filter(bubble => bubble.y + bubble.size > 0)
//         );
//       }, 70); // Increased from 50ms to 70ms

//       // Game timer
//       const gameTimer = setInterval(() => {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             setGameActive(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => {
//         clearInterval(bubbleInterval);
//         clearInterval(animationFrame);
//         clearInterval(gameTimer);
//       };
//     }
//   }, [activeTab, gameActive, bubbles.length]);

//   // Reset game state when changing to bubble pop
//   useEffect(() => {
//     if (activeTab === "bubblePop") {
//       setBubbles([]);
//       setScore(0);
//       setTimeLeft(60);
//     }
//   }, [activeTab]);

//   // Handle card flipping in memory game
//   const flipCard = (index) => {
//     if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
//       return;
//     }
//     setCards(cards.map((card, i) => 
//       i === index ? { ...card, isFlipped: true } : card
//     ));
//     setFlippedCards([...flippedCards, index]);
//   };

//   const resetMemoryGame = () => {
//     const cardPairs = [...gameCards, ...gameCards].slice(0, 16);
//     setCards(cardPairs.map((card, index) => ({
//       id: index,
//       content: card,
//       isFlipped: false,
//       isMatched: false
//     })).sort(() => Math.random() - 0.5));
//     setFlippedCards([]);
//     setMatchedCards([]);
//     setShowCelebration(false);
//   };

//   // Bubble Pop game handlers
//   const startBubbleGame = () => {
//     setBubbles([]);
//     setScore(0);
//     setTimeLeft(60);
//     setGameActive(true);
//   };

//   const popBubble = (id) => {
//     setBubbles(prevBubbles => prevBubbles.filter(bubble => bubble.id !== id));
//     setScore(prevScore => prevScore + 1);
//   };

//   // Handle sound selection
//   const selectSound = (sound) => {
//     setSelectedSound(sound);
//     setMusicPlaying(true);
//   };

//   // Toggle sound playback
//   const togglePlayback = () => {
//     setMusicPlaying(!musicPlaying);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br mt-24 from-gray-50 to-white text-gray-800">
//       <div className="py-12">
//         <motion.h2
//           className="text-sky-600 font-bold text-2xl md:text-4xl text-center mb-4 uppercase tracking-wider"
//           initial={{ opacity: 0, y: -30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           viewport={{ once: true }}
//         >
//           Mindfulness & Mental Wellbeing
//         </motion.h2>
        
//         <motion.div 
//           className="flex items-center justify-center"
//           initial={{ opacity: 0, scaleX: 0 }}
//           whileInView={{ opacity: 1, scaleX: 1 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           viewport={{ once: true }}
//         >
//           <div className="h-1 w-48 md:w-64 bg-sky-600 rounded-full"></div>
//         </motion.div>
        
//         <motion.p
//           className="text-gray-700 text-center max-w-2xl mx-auto mt-6 px-4"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//           viewport={{ once: true }}
//         >
//           Discover practices to cultivate inner peace, reduce stress, and enhance your daily wellbeing through mindful living.
//         </motion.p>
//       </div>
//       <div className="container mx-auto px-4 py-8 max-w-5xl">
//         {/* Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex justify-between items-center mb-8"
//         >
//           <h1 className="text-3xl font-bold text-sky-700">Mindful <span className="text-blue-600">Moments</span></h1>
//           <div className="flex space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={togglePlayback}
//               className={`p-3 rounded-full ${musicPlaying ? 'bg-sky-100 text-sky-700' : 'bg-sky-50 text-sky-600'} hover:opacity-80 shadow-sm`}
//             >
//               {musicPlaying ? <VolumeX size={20} /> : <Music size={20} />}
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowQuote(!showQuote)}
//               className="p-3 rounded-full bg-sky-50 text-sky-600 hover:opacity-80 shadow-sm"
//             >
//               💭
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Tabs */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//           className="flex mb-6 overflow-x-auto pb-2 no-scrollbar"
//         >
//           {["breathing", "sounds", "memory", "bubblePop"].map((tab, index) => (
//             <motion.button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 * index, duration: 0.3 }}
//               className={`px-5 py-3 mr-3 rounded-xl capitalize whitespace-nowrap transition-all text-lg ${
//                 activeTab === tab 
//                   ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md' 
//                   : 'bg-white text-sky-700 hover:bg-sky-50 shadow-sm'
//               }`}
//             >
//               {tab === "bubblePop" ? "Bubble Pop" : tab}
//             </motion.button>
//           ))}
//         </motion.div>

//         {/* Content based on active tab */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.5 }}
//           className="bg-white rounded-2xl p-6 shadow-lg"
//         >
//           {activeTab === "breathing" && (
//             <div className="text-center">
//               <h2 className="text-xl mb-6 font-semibold text-sky-700">Guided Breathing</h2>
//               <div className="flex justify-center items-center h-72">
//                 <motion.div
//                   animate={{
//                     scale: breathePhase === "inhale" ? 1.4 : breathePhase === "hold" ? 1.4 : 1,
//                   }}
//                   transition={{ duration: 4, ease: "easeInOut" }}
//                   className={`w-32 h-32 rounded-full flex items-center justify-center ${
//                     breathePhase === "inhale" 
//                       ? "bg-sky-100" 
//                       : breathePhase === "hold" 
//                         ? "bg-blue-100" 
//                         : "bg-sky-50"
//                   }`}
//                 >
//                   <span className="text-xl capitalize text-sky-700 font-medium">
//                     {breathePhase}
//                   </span>
//                 </motion.div>
//               </div>
//               <p className="mt-8 text-base text-gray-600 max-w-lg mx-auto">
//                 Focus on your breath as it moves in and out. Inhale slowly for 4 seconds, 
//                 hold for 3, then exhale for 4. Let your breath guide you to a state of calm.
//               </p>
//             </div>
//           )}

//           {activeTab === "sounds" && (
//             <div>
//               <h2 className="text-xl mb-6 font-semibold text-sky-700 text-center">Relaxing Sounds</h2>
//               <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
//                 {soundOptions.map((sound, index) => (
//                   <motion.div
//                     key={sound.name}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1, duration: 0.3 }}
//                     onClick={() => selectSound(sound)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`p-4 rounded-xl ${sound.color} flex flex-col items-center cursor-pointer transition-all shadow-sm ${
//                       selectedSound === sound ? 'ring-2 ring-sky-400' : ''
//                     }`}
//                   >
//                     <span className="text-3xl mb-2">{sound.icon}</span>
//                     <span className="text-sm font-medium text-sky-700">{sound.name}</span>
//                   </motion.div>
//                 ))}
//               </div>
              
//               {selectedSound && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-8"
//                 >
//                   <div className="bg-sky-50 p-4 rounded-xl shadow-sm">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={togglePlayback}
//                           className="mr-3"
//                         >
//                           {musicPlaying ? 
//                             <PauseCircle size={28} className="text-sky-600" /> : 
//                             <PlayCircle size={28} className="text-sky-600" />
//                           }
//                         </motion.button>
//                         <div>
//                           <p className="font-medium text-sky-700">{selectedSound.name}</p>
//                           <p className="text-sm text-sky-500">Ambient sounds</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <input 
//                           type="range" 
//                           min="0" 
//                           max="100" 
//                           defaultValue="80"
//                           className="accent-sky-500 w-32" 
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           )}

//           {activeTab === "memory" && (
//             <div>
//               <h2 className="text-xl mb-4 font-semibold text-sky-700 text-center">Memory Match</h2>
//               <p className="text-base text-center text-gray-600 mb-6">
//                 Find matching pairs to exercise your memory
//               </p>
              
//               <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
//                 {cards.map((card, index) => (
//                   <motion.div
//                     key={card.id}
//                     onClick={() => flipCard(index)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ 
//                       opacity: 1, 
//                       scale: 1,
//                       rotateY: (card.isMatched || flippedCards.includes(index)) ? 180 : 0 
//                     }}
//                     transition={{ delay: index * 0.03, duration: 0.3 }}
//                     className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-2xl transition-all shadow-sm ${
//                       card.isMatched || flippedCards.includes(index)
//                         ? 'bg-gradient-to-br from-sky-50 to-blue-50'
//                         : 'bg-white border border-sky-100'
//                     }`}
//                     style={{height: "75px"}}
//                   >
//                     {(card.isMatched || flippedCards.includes(index)) && card.content}
//                   </motion.div>
//                 ))}
//               </div>
              
//               {/* Celebration overlay when memory game is completed */}
//               <AnimatePresence>
//                 {showCelebration && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//                     onClick={() => setShowCelebration(false)}
//                   >
//                     <motion.div 
//                       initial={{ scale: 0.5 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0.5 }}
//                       className="bg-white rounded-xl p-8 text-center max-w-md mx-4"
//                       onClick={e => e.stopPropagation()}
//                     >
//                       <div className="text-5xl mb-4">🎉</div>
//                       <h3 className="text-2xl font-bold text-sky-700 mb-2">Hurray!</h3>
//                       <p className="text-lg text-sky-600 mb-6">
//                         Congratulations! You've successfully completed the memory game!
//                       </p>
//                       <div className="flex justify-center space-x-4">
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           onClick={() => {
//                             resetMemoryGame();
//                             setShowCelebration(false);
//                           }}
//                           className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-sm"
//                         >
//                           Play Again
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           onClick={() => setShowCelebration(false)}
//                           className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 shadow-sm"
//                         >
//                           Close
//                         </motion.button>
//                       </div>
                      
//                       {/* Celebration confetti animation */}
//                       {Array.from({ length: 50 }).map((_, i) => (
//                         <motion.div
//                           key={i}
//                           initial={{ 
//                             x: 0, 
//                             y: 0,
//                             opacity: 1,
//                             scale: Math.random() * 0.5 + 0.5
//                           }}
//                           animate={{ 
//                             x: (Math.random() - 0.5) * window.innerWidth * 0.7, 
//                             y: Math.random() * -window.innerHeight * 0.7,
//                             opacity: 0,
//                             rotate: Math.random() * 360
//                           }}
//                           transition={{ duration: Math.random() * 2 + 1, ease: "easeOut" }}
//                           style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             width: "12px",
//                             height: "12px",
//                             borderRadius: "50%",
//                             backgroundColor: ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'][Math.floor(Math.random() * 5)]
//                           }}
//                         />
//                       ))}
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
          
//           {activeTab === "bubblePop" && (
//             <div>
//               <h2 className="text-xl mb-4 font-semibold text-sky-700 text-center">Bubble Pop</h2>
//               <div className="flex justify-between items-center mb-4">
//                 <div className="text-lg font-medium text-sky-600">Score: {score}</div>
//                 <div className="text-lg font-medium text-sky-600">Time: {timeLeft}s</div>
//               </div>
              
//               {!gameActive && (
//                 <div className="text-center py-8">
//                   <p className="text-gray-600 mb-6">
//                     Pop as many bubbles as you can within 60 seconds. Click on bubbles to pop them!
//                   </p>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={startBubbleGame}
//                     className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl shadow-md text-lg"
//                   >
//                     Start Game
//                   </motion.button>
//                 </div>
//               )}
              
//               {gameActive && (
//                 <div className="relative h-96 bg-gradient-to-b from-sky-50 to-blue-50 rounded-xl overflow-hidden shadow-inner">
//                   {bubbles.map(bubble => (
//                     <motion.div
//                       key={bubble.id}
//                       initial={{ scale: 0.2, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       exit={{ scale: 1.5, opacity: 0 }}
//                       className={`absolute rounded-full cursor-pointer bg-gradient-to-br ${bubble.color} shadow-md flex items-center justify-center`}
//                       style={{
//                         width: `${bubble.size}px`,
//                         height: `${bubble.size}px`,
//                         left: `${bubble.x}%`,
//                         top: `${bubble.y}%`,
//                         transform: 'translate(-50%, -50%)'
//                       }}
//                       onClick={() => popBubble(bubble.id)}
//                     >
//                       <span className="text-white text-opacity-70 select-none" style={{ fontSize: `${bubble.size / 3}px` }}>
//                         pop!
//                       </span>
//                     </motion.div>
//                   ))}
                  
//                   {/* Game over message when time runs out */}
//                   <AnimatePresence>
//                     {timeLeft === 0 && (
//                       <motion.div
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
//                       >
//                         <div className="text-center px-4">
//                           <h3 className="text-2xl font-bold text-sky-700 mb-2">Game Over!</h3>
//                           <p className="text-xl text-sky-600 mb-2">Your score: {score}</p>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={startBubbleGame}
//                             className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-md"
//                           >
//                             Play Again
//                           </motion.button>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </div>
//           )}
//         </motion.div>
//       </div>
      
//       {/* Quote in bottom right with Framer Motion */}
//       <AnimatePresence>
//         {showQuote && (
//           <motion.div 
//             initial={{ opacity: 0, y: 50, x: 50 }}
//             animate={{ opacity: 1, y: 0, x: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             transition={{ 
//               type: "spring", 
//               stiffness: 100, 
//               damping: 15 
//             }}
//             className="fixed bottom-8 right-5 max-w-sm p-5 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90"
//           >
//             <button 
//               onClick={() => setShowQuote(false)}
//               className="absolute top-2 right-2 text-sky-500 hover:text-sky-700"
//             >
//               <X size={18} />
//             </button>
//             <motion.p 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               key={currentQuote.q}
//               transition={{ delay: 0.2 }}
//               className="italic text-base mb-2 text-sky-700"
//             >
//               "{currentQuote.q}"
//             </motion.p>
//             <motion.p 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               key={currentQuote.a}
//               transition={{ delay: 0.4 }}
//               className="text-sm text-sky-600 font-medium text-right"
//             >
//               — {currentQuote.a}
//             </motion.p>
//           </motion.div>
//         )}
//       </AnimatePresence>
      
//       {/* Mini player (when sound is active) */}
//       {musicPlaying && selectedSound && (
//         <motion.div 
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-full shadow-md p-4 flex items-center space-x-4"
//         >
//           <motion.button 
//             whileHover={{ scale: 1.2 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={togglePlayback}
//           >
//             {musicPlaying ? 
//               <PauseCircle size={28} className="text-sky-600" /> : 
//               <PlayCircle size={28} className="text-sky-600" />
//             }
//           </motion.button>
//           <div className="flex-1">
//             <div className="text-sm font-medium text-sky-700">{selectedSound.name}</div>
//             <div className="w-full bg-sky-100 rounded-full h-1.5 mt-1.5">
//               <motion.div 
//                 initial={{ width: "0%" }}
//                 animate={{ width: "40%" }}
//                 transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
//                 className="bg-sky-500 h-1.5 rounded-full"
//               ></motion.div>
//             </div>
//           </div>
//           <span className="text-lg text-sky-500">{selectedSound.icon}</span>
//         </motion.div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX, PauseCircle, PlayCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Quotes from '../../Assets/Data/Quotes.json';
import Meditation from "../../Assets/Music/Meditation.mp3";
import Rain from "../../Assets/Music/Rain.mp3";
import bird from "../../Assets/Music/birds.wav";
import ocean from "../../Assets/Music/ocean.wav";
import forest from "../../Assets/Music/forest.wav";

// Game cards for memory game (slightly expanded set)
const gameCards = ["🌸", "🌿", "🌊", "🌙", "⭐", "🌈", "🔮", "🍃"];

// Available sounds for relaxation with updated sound files
const soundOptions = [
  { name: "Meditation", icon: "🧘", color: "bg-sky-50", sound: Meditation },
  { name: "Rain", icon: "🌧️", color: "bg-sky-100", sound: Rain },
  { name: "Ocean", icon: "🌊", color: "bg-blue-50", sound: ocean },
  { name: "Forest", icon: "🌲", color: "bg-emerald-50", sound: forest },
  { name: "Birds", icon: "🐦", color: "bg-amber-50", sound: bird }
];

// Bubble colors for Bubble Pop game
const bubbleColors = [
  "from-pink-300 to-pink-200",
  "from-blue-300 to-blue-200",
  "from-purple-300 to-purple-200",
  "from-green-300 to-green-200",
  "from-yellow-300 to-yellow-200",
  "from-indigo-300 to-indigo-200",
];

export default function MentalHealth() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(Quotes[0]);
  const [breathePhase, setBreathePhase] = useState("inhale");
  const [activeTab, setActiveTab] = useState("breathing");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [selectedSound, setSelectedSound] = useState(null);
  const [showQuote, setShowQuote] = useState(true);
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef(null);

  // Change quote every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * Quotes.length);
      setCurrentQuote(Quotes[randomIndex]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Breathing exercise timing
  useEffect(() => {
    if (activeTab === "breathing") {
      const breathingInterval = setInterval(() => {
        setBreathePhase(prev => prev === "inhale" ? "hold" : prev === "hold" ? "exhale" : "inhale");
      }, breathePhase === "hold" ? 3000 : 4000);
      return () => clearInterval(breathingInterval);
    }
  }, [breathePhase, activeTab]);

  // Initialize memory game
  useEffect(() => {
    if (activeTab === "memory") {
      const cardPairs = [...gameCards, ...gameCards].slice(0, 16); // Ensure we have 8 pairs (16 cards)
      setCards(cardPairs.map((card, index) => ({
        id: index,
        content: card,
        isFlipped: false,
        isMatched: false
      })).sort(() => Math.random() - 0.5));
      setFlippedCards([]);
      setMatchedCards([]);
      setShowCelebration(false);
    }
  }, [activeTab]);

  // Handle card flipping in memory game
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (cards[firstCard].content === cards[secondCard].content) {
        setMatchedCards(prev => [...prev, firstCard, secondCard]);
      }
      const timer = setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flippedCards, cards]);

  // Check for memory game completion and show celebration
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setTimeout(() => {
        setShowCelebration(true);
      }, 800);
    }
  }, [matchedCards.length, cards.length]);

  // Handle Bubble Pop game
  useEffect(() => {
    if (activeTab === "bubblePop" && gameActive) {
      // Create new bubbles more slowly (every 2 seconds)
      const bubbleInterval = setInterval(() => {
        if (bubbles.length < 8) { // Reduced max bubbles from 10 to 8
          const newBubble = {
            id: Date.now(),
            x: Math.random() * 80 + 10, // 10-90% of container width
            y: 100, // Start at bottom
            size: Math.random() * 40 + 30, // 30-70px
            color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
            speed: Math.random() * 1 + 0.5, // Reduced speed: 0.5-1.5px per frame (was 1-3px)
          };
          setBubbles(prev => [...prev, newBubble]);
        }
      }, 2000); // Increased from 1000ms to 2000ms

      // Move bubbles upward more slowly
      const animationFrame = setInterval(() => {
        setBubbles(prevBubbles => 
          prevBubbles
            .map(bubble => ({
              ...bubble,
              y: bubble.y - bubble.speed,
            }))
            .filter(bubble => bubble.y + bubble.size > 0)
        );
      }, 70); // Increased from 50ms to 70ms

      // Game timer
      const gameTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(bubbleInterval);
        clearInterval(animationFrame);
        clearInterval(gameTimer);
      };
    }
  }, [activeTab, gameActive, bubbles.length]);

  // Reset game state when changing to bubble pop
  useEffect(() => {
    if (activeTab === "bubblePop") {
      setBubbles([]);
      setScore(0);
      setTimeLeft(60);
    }
  }, [activeTab]);

  // Audio handling
  useEffect(() => {
    // Cleanup previous audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle sound playback based on musicPlaying state and selectedSound
  useEffect(() => {
    if (selectedSound) {
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedSound.sound);
        audioRef.current.loop = true;
      }
      
      if (musicPlaying) {
        audioRef.current.volume = volume / 100;
        try {
          audioRef.current.play().catch(error => {
            console.error("Audio playback error:", error);
          });
        } catch (error) {
          console.error("Audio playback error:", error);
        }
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    return () => {
      if (audioRef.current && !selectedSound) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicPlaying, selectedSound, volume]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle card flipping in memory game
  const flipCard = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }
    setCards(cards.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards([...flippedCards, index]);
  };

  const resetMemoryGame = () => {
    const cardPairs = [...gameCards, ...gameCards].slice(0, 16);
    setCards(cardPairs.map((card, index) => ({
      id: index,
      content: card,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setShowCelebration(false);
  };

  // Bubble Pop game handlers
  const startBubbleGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
  };

  const popBubble = (id) => {
    setBubbles(prevBubbles => prevBubbles.filter(bubble => bubble.id !== id));
    setScore(prevScore => prevScore + 1);
  };

  // Handle sound selection
  const selectSound = (sound) => {
    // If selecting a different sound, stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setSelectedSound(sound);
    setMusicPlaying(true);
  };

  // Toggle sound playback
  const togglePlayback = () => {
    setMusicPlaying(!musicPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-24  text-gray-800">
      <div className="py-12">
        <motion.h2
          className="text-sky-600 font-bold text-2xl md:text-4xl text-center mb-4 uppercase tracking-wider"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Mindfulness & Mental Wellbeing
        </motion.h2>
        
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="h-1 w-48 md:w-64 bg-sky-600 rounded-full"></div>
        </motion.div>
        
        <motion.p
          className="text-gray-700 text-center max-w-2xl mx-auto mt-6 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Discover practices to cultivate inner peace, reduce stress, and enhance your daily wellbeing through mindful living.
        </motion.p>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-700">Mindful <span className="text-blue-600">Moments</span></h1>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayback}
              className={`p-3 rounded-full ${musicPlaying ? 'bg-sky-100 text-sky-700' : 'bg-sky-50 text-sky-600'} hover:opacity-80 shadow-sm`}
            >
              {musicPlaying ? <VolumeX size={20} /> : <Music size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuote(!showQuote)}
              className="p-3 rounded-full bg-sky-50 text-sky-600 hover:opacity-80 shadow-sm"
            >
              💭
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex mb-6 overflow-x-auto pb-2 no-scrollbar"
        >
          {["breathing", "sounds", "memory", "bubblePop"].map((tab, index) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className={`px-5 py-3 mr-3 rounded-xl capitalize whitespace-nowrap transition-all text-lg ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md' 
                  : 'bg-white text-sky-700 hover:bg-sky-50 shadow-sm'
              }`}
            >
              {tab === "bubblePop" ? "Bubble Pop" : tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Content based on active tab */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          {activeTab === "breathing" && (
            <div className="text-center">
              <h2 className="text-xl mb-6 font-semibold text-sky-700">Guided Breathing</h2>
              <div className="flex justify-center items-center h-72">
                <motion.div
                  animate={{
                    scale: breathePhase === "inhale" ? 1.4 : breathePhase === "hold" ? 1.4 : 1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    breathePhase === "inhale" 
                      ? "bg-sky-100" 
                      : breathePhase === "hold" 
                        ? "bg-blue-100" 
                        : "bg-sky-50"
                  }`}
                >
                  <span className="text-xl capitalize text-sky-700 font-medium">
                    {breathePhase}
                  </span>
                </motion.div>
              </div>
              <p className="mt-8 text-base text-gray-600 max-w-lg mx-auto">
                Focus on your breath as it moves in and out. Inhale slowly for 4 seconds, 
                hold for 3, then exhale for 4. Let your breath guide you to a state of calm.
              </p>
            </div>
          )}

          {activeTab === "sounds" && (
            <div>
              <h2 className="text-xl mb-6 font-semibold text-sky-700 text-center">Relaxing Sounds</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {soundOptions.map((sound, index) => (
                  <motion.div
                    key={sound.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => selectSound(sound)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl ${sound.color} flex flex-col items-center cursor-pointer transition-all shadow-sm ${
                      selectedSound === sound ? 'ring-2 ring-sky-400' : ''
                    }`}
                  >
                    <span className="text-3xl mb-2">{sound.icon}</span>
                    <span className="text-sm font-medium text-sky-700">{sound.name}</span>
                  </motion.div>
                ))}
              </div>
              
              {selectedSound && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <div className="bg-sky-50 p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={togglePlayback}
                          className="mr-3"
                        >
                          {musicPlaying ? 
                            <PauseCircle size={28} className="text-sky-600" /> : 
                            <PlayCircle size={28} className="text-sky-600" />
                          }
                        </motion.button>
                        <div>
                          <p className="font-medium text-sky-700">{selectedSound.name}</p>
                          <p className="text-sm text-sky-500">Ambient sounds</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={volume}
                          onChange={handleVolumeChange}
                          className="accent-sky-500 w-32" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === "memory" && (
            <div>
              <h2 className="text-xl mb-4 font-semibold text-sky-700 text-center">Memory Match</h2>
              <p className="text-base text-center text-gray-600 mb-6">
                Find matching pairs to exercise your memory
              </p>
              
              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    onClick={() => flipCard(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateY: (card.isMatched || flippedCards.includes(index)) ? 180 : 0 
                    }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-2xl transition-all shadow-sm ${
                      card.isMatched || flippedCards.includes(index)
                        ? 'bg-gradient-to-br from-sky-50 to-blue-50'
                        : 'bg-white border border-sky-100'
                    }`}
                    style={{height: "75px"}}
                  >
                    {(card.isMatched || flippedCards.includes(index)) && card.content}
                  </motion.div>
                ))}
              </div>
              
              {/* Celebration overlay when memory game is completed */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowCelebration(false)}
                  >
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      className="bg-white rounded-xl p-8 text-center max-w-md mx-4"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold text-sky-700 mb-2">Hurray!</h3>
                      <p className="text-lg text-sky-600 mb-6">
                        Congratulations! You've successfully completed the memory game!
                      </p>
                      <div className="flex justify-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            resetMemoryGame();
                            setShowCelebration(false);
                          }}
                          className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-sm"
                        >
                          Play Again
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowCelebration(false)}
                          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 shadow-sm"
                        >
                          Close
                        </motion.button>
                      </div>
                      
                      {/* Celebration confetti animation */}
                      {Array.from({ length: 50 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ 
                            x: 0, 
                            y: 0,
                            opacity: 1,
                            scale: Math.random() * 0.5 + 0.5
                          }}
                          animate={{ 
                            x: (Math.random() - 0.5) * window.innerWidth * 0.7, 
                            y: Math.random() * -window.innerHeight * 0.7,
                            opacity: 0,
                            rotate: Math.random() * 360
                          }}
                          transition={{ duration: Math.random() * 2 + 1, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'][Math.floor(Math.random() * 5)]
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {activeTab === "bubblePop" && (
            <div>
              <h2 className="text-xl mb-4 font-semibold text-sky-700 text-center">Bubble Pop</h2>
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-medium text-sky-600">Score: {score}</div>
                <div className="text-lg font-medium text-sky-600">Time: {timeLeft}s</div>
              </div>
              
              {!gameActive && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-6">
                    Pop as many bubbles as you can within 60 seconds. Click on bubbles to pop them!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startBubbleGame}
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl shadow-md text-lg"
                  >
                    Start Game
                  </motion.button>
                </div>
              )}
              
              {gameActive && (
                <div className="relative h-96 bg-gradient-to-b from-sky-50 to-blue-50 rounded-xl overflow-hidden shadow-inner">
                  {bubbles.map(bubble => (
                    <motion.div
                      key={bubble.id}
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className={`absolute rounded-full cursor-pointer bg-gradient-to-br ${bubble.color} shadow-md flex items-center justify-center`}
                      style={{
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => popBubble(bubble.id)}
                    >
                      <span className="text-white text-opacity-70 select-none" style={{ fontSize: `${bubble.size / 3}px` }}>
                        pop!
                      </span>
                    </motion.div>
                  ))}
                  
                  {/* Game over message when time runs out */}
                  <AnimatePresence>
                    {timeLeft === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
                      >
                        <div className="text-center px-4">
                          <h3 className="text-2xl font-bold text-sky-700 mb-2">Game Over!</h3>
                          <p className="text-xl text-sky-600 mb-2">Your score: {score}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startBubbleGame}
                            className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-md"
                          >
                            Play Again
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Quote in bottom right with Framer Motion */}
      <AnimatePresence>
        {showQuote && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15 
            }}
            className="fixed bottom-8 right-5 max-w-sm p-5 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90"
          >
            <button 
              onClick={() => setShowQuote(false)}
              className="absolute top-2 right-2 text-sky-500 hover:text-sky-700"
            >
              <X size={18} />
            </button>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentQuote.q}
              transition={{ delay: 0.2 }}
              className="italic text-base mb-2 text-sky-700"
            >
              "{currentQuote.q}"
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentQuote.a}
              transition={{ delay: 0.4 }}
              className="text-sm text-sky-600 font-medium text-right"
            >
              — {currentQuote.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mini player (when sound is active) */}
      {musicPlaying && selectedSound && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-full shadow-md p-4 flex items-center space-x-4"
        >
          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayback}
          >
            {musicPlaying ? 
              <PauseCircle size={28} className="text-sky-600" /> : 
              <PlayCircle size={28} className="text-sky-600" />
            }
          </motion.button>
          <div className="flex-1">
            <div className="text-sm font-medium text-sky-700">{selectedSound.name}</div>
            <div className="w-full bg-sky-100 rounded-full h-1.5 mt-1.5">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 120, repeat: Infinity, repeatType: "reverse" }}
                className="bg-sky-500 h-1.5 rounded-full"
              ></motion.div>
            </div>
          </div>
          <span className="text-lg text-sky-500">{selectedSound.icon}</span>
        </motion.div>
      )}
      
    
    </div>
  );
}