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
    iframe.setAttribute('title', 'Видео на ТехПульс');

    node.appendChild(iframe);
    return node;
  }

  static sanitizeUrl(url: string) {
    if (!url) {
      console.warn('URL is missing or invalid for video embed.');
      return '';
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
    } else if (url.includes('vkvideo.ru')) {
      return VideoBlot.convertVkVideoUrl(url);
    } else if (url.includes('t.me')) {
      return VideoBlot.convertTelegramUrl(url);
    } else if (url.includes('vk.com')) {
      return VideoBlot.convertVkUrl(url);
    }
    return url;
  }

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

  static convertVkVideoUrl(url: string): string {
    const regex = /video(-?\d+)_(\d+)/;
    const match = url.match(regex);

    if (match) {
      const oid = match[1];
      const id = match[2];
      return `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=1`;
    }

    console.warn('Invalid VK video URL:', url);
    return '';
  }

  static convertVkUrl(url: string): string {
    const regex = /video(-?\d+)_(\d+)/;
    const match = url.match(regex);

    if (match) {
      const oid = match[1];
      const id = match[2];
      return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=1`;
    }

    console.warn('Invalid VK video URL:', url);
    return '';
  }

  static convertTelegramUrl(url: string) {
    if (url.startsWith('https://t.me/')) {
      const parts = url.split('/');
      const channel = parts[3];
      const messageId = parts[4];
      return `https://t.me/${channel}/${messageId}?embed=1`;
    }
    return url;
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
