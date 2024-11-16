import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { Button, useTheme, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const { width } = Dimensions.get('window');

const DictateScreen: React.FC = () => {
    const theme = useTheme();
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [audioPath, setAudioPath] = useState('');
    const [cutStart, setCutStart] = useState<number | null>(null);

    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

    // Start Recording
    const onStartRecord = async () => {
        try {
            const path = 'recorded_audio.m4a';
            const result = await audioRecorderPlayer.startRecorder(path);
            setAudioPath(result);
            setIsRecording(true);
            audioRecorderPlayer.addRecordBackListener(() => {
                return;
            });
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    // Stop Recording
    const onStopRecord = async () => {
        try {
            await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setIsRecording(false);
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    // Start Playback
    const onStartPlay = async () => {
        try {
            const result = await audioRecorderPlayer.startPlayer(audioPath);
            setIsPlaying(true);
            audioRecorderPlayer.addPlayBackListener((e) => {
                setDuration(e.duration);
                setCurrentPosition(e.currentPosition);
                setProgress(e.currentPosition / e.duration);
                if (e.currentPosition >= e.duration) {
                    onStopPlay();
                }
                return;
            });
        } catch (error) {
            console.error('Error starting playback:', error);
        }
    };

    // Stop Playback
    const onStopPlay = async () => {
        try {
            await audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            setIsPlaying(false);
            setProgress(0);
        } catch (error) {
            console.error('Error stopping playback:', error);
        }
    };

    // Seek Audio
    const onSeek = async (value: number) => {
        const seekPosition = value * duration;
        await audioRecorderPlayer.seekToPlayer(seekPosition);
        setCurrentPosition(seekPosition);
        setProgress(value);
    };

    // Format Time (mm:ss)
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Set Cut Start
    const onCutStart = () => {
        setCutStart(currentPosition);
        Alert.alert('Cut Start Point', `Starting cut at ${formatTime(currentPosition)}`);
    };

    // Confirm and Cut Audio
    const onCutAudio = () => {
        if (cutStart === null) {
            Alert.alert('Error', 'Please set a start point before cutting.');
            return;
        }

        // Implement cutting logic (not functional here, but can be added with audio manipulation libraries)
        Alert.alert(
            'Cut Audio',
            `Cutting from ${formatTime(cutStart)} to ${formatTime(currentPosition)}.`,
        );
        setCutStart(null);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
                Audio Recorder/Player
            </Text>

            {/* Progress Bar */}
            {audioPath ? (
                <View style={styles.progressContainer}>
                    <Slider
                        style={styles.slider}
                        value={progress}
                        onValueChange={onSeek}
                        minimumValue={0}
                        maximumValue={1}
                        step={0.01}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor="#ccc"
                        thumbTintColor={theme.colors.primary}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{formatTime(currentPosition)}</Text>
                        <Text style={styles.time}>{formatTime(duration)}</Text>
                    </View>
                </View>
            ) : null}

            {/* Controls */}
            <View style={styles.controls}>
                <IconButton
                    icon="delete"
                    size={32}
                    color={theme.colors.error}
                    onPress={() => setAudioPath('')}
                    disabled={!audioPath || isRecording}
                />

                <IconButton
                    icon={isRecording ? 'stop' : 'microphone'}
                    size={48}
                    color="#fff"
                    style={[
                        styles.circleButton,
                        { backgroundColor: isRecording ? theme.colors.error : theme.colors.primary },
                    ]}
                    onPress={isRecording ? onStopRecord : onStartRecord}
                />

                <IconButton
                    icon={isPlaying ? 'pause' : 'play'}
                    size={32}
                    color={theme.colors.primary}
                    onPress={isPlaying ? onStopPlay : onStartPlay}
                    disabled={!audioPath || isRecording}
                />
            </View>

            {/* Additional Editing Controls */}
            <View style={styles.editingControls}>
                <Button
                    mode="outlined"
                    icon="scissors-cutting"
                    onPress={onCutStart}
                    disabled={!audioPath || isRecording}
                    style={{ marginRight: 8 }}>
                    Set Cut Start
                </Button>
                <Button
                    mode="outlined"
                    icon="content-cut"
                    onPress={onCutAudio}
                    disabled={cutStart === null || isRecording}>
                    Confirm Cut
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    progressContainer: {
        width: width - 40,
        alignItems: 'center',
        marginBottom: 30,
    },
    slider: {
        width: '100%',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
        marginBottom: 20,
    },
    circleButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    editingControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});

export default DictateScreen;
