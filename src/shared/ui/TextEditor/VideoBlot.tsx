import Quill from 'quill';
import * as Parchment from 'parchment';

const BlockEmbed = Quill.import(
  'blots/block/embed'
) as typeof Parchment.EmbedBlot;

class VideoBlot extends BlockEmbed {
  static create(value: { url: string }) {
    const node = super.create() as HTMLElement;
    const iframe = document.createElement('iframe');

    iframe.setAttribute('src', VideoBlot.sanitizeUrl(value.url));
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '450');

    node.appendChild(iframe);
    return node;
  }

  static sanitizeUrl(url: string) {
    if (!url) {
      console.warn('URL is missing or invalid for video embed.');
      return ''; // Вернуть пустую строку, если URL отсутствует
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return VideoBlot.convertYouTubeUrl(url);
    } else if (url.includes('rutube.ru')) {
      return VideoBlot.convertRuTubeUrl(url);
    } else if (url.includes('tiktok.com')) {
      return VideoBlot.convertTikTokUrl(url);
    } else if (url.includes('vimeo.com')) {
      return VideoBlot.convertVimeoUrl(url);
    } else if (url.includes('dailymotion.com')) {
      return VideoBlot.convertDailymotionUrl(url);
    } else if (url.includes('facebook.com')) {
      return VideoBlot.convertFacebookUrl(url);
    } else if (url.includes('instagram.com')) {
      return VideoBlot.convertInstagramUrl(url);
    } else if (url.includes('twitter.com')) {
      return VideoBlot.convertTwitterUrl(url);
    } else if (url.includes('twitch.tv')) {
      return VideoBlot.convertTwitchUrl(url);
    }
    return url;
  }

  // Добавляем методы для каждой платформы

  static convertYouTubeUrl(url: string) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()
      : new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  static convertRuTubeUrl(url: string) {
    return url.replace('/video/', '/play/embed/');
  }

  static convertTikTokUrl(url: string) {
    return `https://www.tiktok.com/embed/${url.split('/').pop()}`;
  }

  static convertVimeoUrl(url: string) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }

  static convertDailymotionUrl(url: string) {
    const videoId = url.split('/').pop();
    return `https://www.dailymotion.com/embed/video/${videoId}`;
  }

  static convertFacebookUrl(url: string) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}`;
  }

  static convertInstagramUrl(url: string) {
    return `https://www.instagram.com/p/${url
      .split('/')
      .filter(Boolean)
      .pop()}/embed/`;
  }

  static convertTwitterUrl(url: string) {
    return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
  }

  static convertTwitchUrl(url: string) {
    const videoId = url.includes('videos')
      ? url.split('/').pop()
      : url.split('/').pop();
    return `https://player.twitch.tv/?video=${videoId}&parent=yourdomain.com`;
  }

  static value(node: HTMLElement) {
    const iframe = node.querySelector('iframe');
    return { url: iframe?.getAttribute('src') || '' };
  }
}

VideoBlot.blotName = 'video';
VideoBlot.tagName = 'div';
VideoBlot.className = 'ql-video-blot';

Quill.register(VideoBlot);

export { VideoBlot };
