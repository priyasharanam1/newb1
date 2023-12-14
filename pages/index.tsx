import CustomModal from '@/components/Models/Modal';
import Footer from '@/components/footer';
import Layout from '@/components/layout';
import SubscribeForm from '@/components/subscribeSection';
import { dynamodb } from '@/config/AWS';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { MdMargin } from 'react-icons/md';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/Navbar.module.css';

export default function Home() {
  const [link, setLink] = useState<any>();
  const router = useRouter();
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (!isRecaptchaVerified) {
      setIsModalOpen(true);
      return;
    }
    Swal.fire({
      title: '⌛',
      html: '<b>Hold on ! We are fetching...</b>',
      backdrop: false,
      padding: '3em',
      color: '#666666',
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const uniqueString = uuidv4();
    router.prefetch(`/playground/${uniqueString}`);

    const formData: any = new FormData();

    formData.append('files', {});

    formData.append('nameSpace', uniqueString);
    formData.append('links', JSON.stringify([link]));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      router.push(`/playground/${uniqueString}`);

      const params = {
        TableName: `${process.env.NEXT_PUBLIC_PLAYGROUND_TABLE}`,
        Item: {
          nameSpace: uniqueString,
          link: link,
          userName: '',
          email: '',
          contact: '',
        },
        ConditionExpression: 'attribute_not_exists(id)',
      };
      await dynamodb.put(params).promise();

      Swal.fire({
        icon: 'success',
        title: 'Successfully fetched!',
        html: '<b>Hurry!</b>',
        backdrop: false,
        padding: '3em',
        color: '#666666',
        confirmButtonColor: '#ffc40c',
      });
    } catch (error) {
      console.error('Error occurred while uploading files', error);
    }
  };

  const handleRecaptchaChange = () => {
    setIsRecaptchaVerified(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Layout>
        <div className={styles.container}>
          <div className="p-10 flex-1 w-100">
            <div className={styles.heroText}>
              <h1
              >
                Revolutionizing <br /> Industries with <br /> AI Assistance
              </h1>
              {/* Add your paragraph here */}
              {/* <p className="mt-4 text-white text-base md:text-lg">
              Your paragraph content
              </p> */}
            </div>
          </div>
          <div style={{ marginRight: '6rem' }}>
            <img
              src="/images/hero-bot.png"
              alt="Hero Bot"
              style={{ minWidth: '300px', minHeight: '400px' }} // Adjust the margin as needed
            />
          </div>
        </div>

        <div
        className={styles.heroContent}
        >
          <p>
            Experience the convergence of innovation and functionality with
            Debales AI Assistant.
          </p>
          <div style={{ display: 'flex', margin: 'auto', gap: '4rem' }}>
            <span>e-Commerce</span>
            <span>Retail</span>
            <span>Recruitment</span>
          </div>

          <div className="max-w-screen-xl mx-auto flex flex-col my-16 gap-14 items-center w-full ">
            <div className="text-center my-36 text-4xl">
              <div className="text-[#ff0947] mb-8 ">
                Create an AI Assistant Right Now
              </div>
              <div className="flex space-x-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="floating_outlined"
                    onChange={(event) => {
                      setLink(event.target.value);
                    }}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#ffd000] focus:outline-none focus:ring-0 focus:border-[#ffd000] peer "
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_outlined"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white 1dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#440034] peer-focus:dark:text-[#440034] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Enter any link to Train
                  </label>
                </div>
                <button
                  className="md:text-xl text-sm font-semibold border-[1.5px] bg-[#ffd000]  px-4 py-2 rounded-lg hover:text-white hover:bg-[#3a0035] transition-all duration-300 w-52"
                  onClick={handleClick}
                  id="dsa-home-createInstantBot"
                >
                  Create Now
                </button>
              </div>

              {/* Open the modal when isRecaptchaVerified is false */}
              {!isRecaptchaVerified && (
                <CustomModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                >
                  <h2 className="text-2xl font-normal mb-4">
                    Prove You're Not a Robot
                  </h2>
                  <div className="flex flex-col justify-center items-center h-full">
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                </CustomModal>
              )}
            </div>
            {/* <div className="shadow-2xl rounded-3xl border m-4 border-gray-600">
            <video
              autoPlay={true}
              className="rounded-3xl"
              loop
              muted
              ref={vidRef}
              src="/videos/vokoscreenNG-2023-09-04_09-20-43.mp4"
            ></video>
          </div> */}
          </div>
        </div>

        <SubscribeForm />
        <Footer />
      </Layout>
    </>
  );
}
