import React from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';

type Props = ImageProps & {
	alt: string;
	size?: number;
	borderRadius?: number;
};

const AccessibleImage: React.FC<Props> = ({alt, size = 48, borderRadius = 4, style, ...rest}) => {
	return (
		<View
			accessible
			accessibilityRole="image"
			accessibilityLabel={alt}
			style={[styles.container, {width: size, height: size, borderRadius}]}>
			<Image
				style={[styles.image, {width: size, height: size, borderRadius}, style]}
				{...rest}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
	},
	image: {
		resizeMode: 'cover',
	},
});

export default AccessibleImage;


