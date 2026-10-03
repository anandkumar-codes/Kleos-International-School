import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';
import { Chips, Empty, LargeHeader, tap } from '@/components/ui';
import { galleryCategories } from '@shared/data/content';

export default function Gallery() {
  const { state } = useStore();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);
  const list = state.gallery.filter((g) => cat === 'All' || g.category === cat);
  const tile = (width - 16 * 2 - 10) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <LargeHeader title="Gallery" subtitle={`${state.gallery.length} photos from campus life`} />
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <Chips options={[{ value: 'All', label: 'All', count: state.gallery.length }, ...galleryCategories.map((c) => ({ value: c, label: c, count: state.gallery.filter((g) => g.category === c).length }))]} value={cat} onChange={setCat} />
      </View>
      <FlatList
        data={list}
        key={cat}
        numColumns={2}
        keyExtractor={(g) => g.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        ListEmptyComponent={<Empty icon="image" title="No photos here yet" />}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => { tap(); setOpen(index); }} style={({ pressed }) => ({ width: tile, height: index % 3 === 0 ? tile * 1.25 : tile, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.green100, opacity: pressed ? 0.85 : 1 })}>
            <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
            <View style={{ position: 'absolute', left: 8, bottom: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: 'rgba(5,40,30,0.7)' }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 10.5, color: '#fff' }}>{item.category}</Text>
            </View>
          </Pressable>
        )}
      />

      <Modal visible={open != null} transparent animationType="fade" onRequestClose={() => setOpen(null)} statusBarTranslucent>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: 'rgba(4,18,14,0.97)' }}>
          <FlatList
            data={list}
            horizontal
            pagingEnabled
            initialScrollIndex={open ?? 0}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(g) => g.id}
            onMomentumScrollEnd={(e) => setOpen(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <View style={{ width, height, justifyContent: 'center' }}>
                <Image source={item.image.replace('w=1200', 'w=1600')} style={{ width, height: width * 1.1 }} contentFit="contain" transition={250} />
              </View>
            )}
          />
          <View style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.semibold, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{(open ?? 0) + 1} / {list.length}</Text>
            <Pressable accessibilityLabel="Close" onPress={() => setOpen(null)} hitSlop={12} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="x" size={22} color="#fff" />
            </Pressable>
          </View>
          {open != null && list[open] ? (
            <View style={{ position: 'absolute', bottom: insets.bottom + 28, left: 20, right: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.2, color: colors.gold400 }}>{list[open].category.toUpperCase()}</Text>
              <Text style={{ fontFamily: fonts.display, fontSize: 20, color: '#fff', marginTop: 4 }}>{list[open].title}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Swipe for more</Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}
